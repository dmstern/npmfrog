import axios, { AxiosResponse, AxiosPromise } from 'axios';
import * as fs from 'fs-extra';
import * as tar from 'tar';
import * as showdown from 'showdown';
import * as emoji from 'node-emoji';
import { PackagesResponse } from '../types/PackageResponse';

import config from './config-service.js';
const repoKey = config.artifactory.repoKey;
const tmpDir = `${__dirname}/../tmp`;
const packageDetailCache = {};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const s = config.artifactory.https ? 's' : '';
axios.defaults.baseURL = `http${s}://${
  config.artifactory.host
}/artifactory/api/npm/${repoKey}`;
axios.defaults.headers.common.Authorization = config.artifactory.apiKey;

function name2url({ scope, packageName }) {
  return `${scope ? `${scope}/` : ''}${packageName}`;
}

function createAxiosResponse(data: any): AxiosResponse<any> {
  return {
    data,
    status: 200,
    config: undefined,
    headers: undefined,
    request: undefined,
    statusText: undefined,
  };
}

function readme2Html(readmeFile): string {
  let readme;
  try {
    readme = fs.readFileSync(readmeFile);
  } catch (error) {
    throw new Error(`README file not found: ${readmeFile}`);
  }

  const emojifiedReadme = emoji.emojify(readme.toString());
  const converter = new showdown.Converter();
  const html = converter.makeHtml(emojifiedReadme);
  return html;
}

function readMainCode(storageDir): string {
  const packageJson = fs.readJSONSync(`${storageDir}/package.json`);
  try {
    return fs.readFileSync(`${storageDir}/${packageJson.main}`).toString();
  } catch (error) {
    console.error(`MainCode file not found: ${storageDir}`);
    return null;
  }
}

function fetchPackages(): AxiosPromise<PackagesResponse> {
  if (process.env.MOCK) {
    return new Promise<AxiosResponse>((resolve, reject) => {
      resolve(createAxiosResponse(fs.readJSONSync(`${__dirname}/mock/packages-all.json`)));
    });
  }
  return (axios.get(`/-/all`));
}

async function getPackageDetail({ scope, packageName }): Promise<AxiosResponse> {
  const latestVersionResponse = await getDistTags({ scope, packageName });
  const latestVersion = latestVersionResponse.data.latest;
  const key = `${scope}-${packageName}-${latestVersion}`;

  const packageDetailResonse: AxiosResponse = process.env.MOCK
    ? await new Promise<AxiosResponse>((resolve, reject) => {
      const packageResource = `${__dirname}/mock/${packageName}.json`;
      let data;
      try {
        data = fs.readJSONSync(packageResource);
      } catch (error) {
        data = fs.readJSONSync(`${__dirname}/mock/fractal-menu-enhancer.json`);
      }
      resolve(createAxiosResponse(data));
    })
    : packageDetailCache[key]
      ? await new Promise<AxiosResponse>((resolve, reject) => {
          resolve(createAxiosResponse(packageDetailCache[key]));
        })
      : await axios.get(`/${name2url({ scope, packageName })}`);

  const additionalCode = process.env.MOCK
    ? await new Promise((resolve) => {
        const packageResource = `${__dirname}/mock/${packageName}.readme.md`;
        let data;
        try {
          data = readme2Html(packageResource);
        } catch (error) {
          data = readme2Html(`${__dirname}/mock/fractal-menu-enhancer.readme.md`);
        }
        resolve({
          readme: data,
          mainCode: readMainCode(`${__dirname}/..`),
        });
      })
    : await new Promise(async (resolve, reject) => {
        const packageDetail = packageDetailResonse.data;
        const downloadUrl = packageDetail.versions[latestVersion].dist.tarball;
        const storageDir = `${tmpDir}/${scope}/${packageName}/${latestVersion}`;
        if (fs.existsSync(storageDir)) {
          resolve(readAdditionalCode(storageDir));
        } else {
          axios
            // Request package:
            .request({
              responseType: 'arraybuffer',
              url: downloadUrl,
              method: 'get',
              headers: {
                'Content-Type': 'application/gzip',
              },
            })
            // Store package in filesystem:
            .then((result) => {
              fs.ensureDirSync(storageDir);
              const outputFilename = `${storageDir}/${packageName}-${latestVersion}.tar.gz`;
              fs.writeFileSync(outputFilename, result.data);
              return outputFilename;
            })
            // Extract package:
            .then((file) => {
              const cwd = storageDir;
              return tar.x({ file, cwd }).then(() => cwd);
            })
            .then((dir) => {
              resolve(readAdditionalCode(dir));
            });
        }
      });

  Object.assign(packageDetailResonse.data, additionalCode);
  return new Promise<AxiosResponse>((resolve, reject) => {
    packageDetailCache[key] = packageDetailResonse.data;
    resolve(packageDetailResonse);
  });
}

function readAdditionalCode(storageDir) {
  let readme;
  let mainCode;
  try {
    readme = readme2Html(`${storageDir}/package/README.md`);
  } catch (error) {
    readme = undefined;
  }
  try {
    mainCode = readMainCode(`${storageDir}/package`);
  } catch (error) {
    mainCode = undefined;
  }
  return {
    readme,
    mainCode,
  };
}

function getDistTags({ scope, packageName }): AxiosPromise<any> {
  return process.env.MOCK
    ? new Promise<AxiosResponse>((resolve, reject) => {
        resolve(createAxiosResponse({
          latest: '1.1.0',
        }));
      })
    : axios.get(`/-/package/${name2url({ scope, packageName })}/dist-tags`);
}

export default {
  fetchPackages,
  getDistTags,
  getPackageDetail,
  baseURL: axios.defaults.baseURL,
};
