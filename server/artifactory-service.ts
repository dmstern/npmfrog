import axios, { AxiosResponse, AxiosPromise } from 'axios';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as tar from 'tar';
import * as showdown from 'showdown';
import * as emoji from 'node-emoji';
import { PackagesResponse } from '../types/PackageResponse';
import PackageId from '../types/PackageId';

import config from './config-service.js';
const repoKey = config.artifactory.repoKey;
const tmpDir = `${__dirname}/../../package-cache`;
const packageDetailCache = {};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const s = config.artifactory.https ? 's' : '';
axios.defaults.baseURL = `http${s}://${
  config.artifactory.host
}/artifactory/api/npm/${repoKey}`;
axios.defaults.headers.common.Authorization = config.artifactory.apiKey;

interface AdditionalCode {
  readme: string;
  mainCode: string | undefined;
}

function name2url({ scope, packageName }: PackageId): string {
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

function readme2Html(readmeFile: string): string {
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

function readMainCode(storageDir: string): string {
  const packageJson = fs.readJSONSync(path.join(storageDir, `package.json`));
  try {
    return fs.readFileSync(path.join(storageDir, packageJson.main)).toString();
  } catch (error) {
    console.error(`MainCode file not found: ${storageDir}`);
    return null;
  }
}

function fetchPackages(): AxiosPromise<PackagesResponse> {
  if (process.env.MOCK) {
    return new Promise<AxiosResponse>((resolve, reject) => {
      resolve(
        createAxiosResponse(
          fs.readJSONSync(path.join(__dirname, 'mock', 'packages-all.json')),
        ),
      );
    });
  }
  return axios.get(`/-/all`);
}

async function getPackageDetail({
  scope,
  packageName,
  version,
}: PackageId): Promise<AxiosResponse> {
  console.log('=============version', version);
  const latestVersionResponse = await getDistTags({ scope, packageName });
  const currentVersion = version || latestVersionResponse.data.latest;
  const key = `${scope}-${packageName}-${currentVersion}`;

  const packageDetailResonse: AxiosResponse = process.env.MOCK
    ? await new Promise<AxiosResponse>((resolve, reject) => {
        const packageResource = path.join(
          __dirname,
          'mock',
          `${packageName}.json`,
        );
        let data;
        try {
          data = fs.readJSONSync(packageResource);
        } catch (error) {
          data = fs.readJSONSync(
            path.join(__dirname, 'mock', 'fractal-menu-enhancer.json'),
          );
        }
        resolve(createAxiosResponse(data));
      })
    : packageDetailCache[key]
      ? await new Promise<AxiosResponse>((resolve, reject) => {
          resolve(createAxiosResponse(packageDetailCache[key]));
        })
      : await axios.get(`/${name2url({ scope, packageName })}`);

  const additionalCode: AdditionalCode = process.env.MOCK
    ? await new Promise<AdditionalCode>((resolve) => {
        const packageResource = path.join(
          __dirname,
          'mock',
          `${packageName}.readme.md`,
        );
        let data;
        try {
          data = readme2Html(packageResource);
        } catch (error) {
          data = readme2Html(
            path.join(__dirname, 'mock', 'fractal-menu-enhancer.readme.md'),
          );
        }
        resolve({
          readme: data,
          mainCode: readMainCode(path.join(__dirname, '..', '..')),
        });
      })
    : await new Promise<AdditionalCode> (async (resolve, reject) => {
        const packageDetail = packageDetailResonse.data;
        const downloadUrl = packageDetail.versions[currentVersion].dist.tarball;
        const storageDir = path.join(
          tmpDir,
          scope || '',
          packageName,
          currentVersion,
        );
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
              const outputFilename = path.join(
                storageDir,
                `${packageName}-${currentVersion}.tar.gz`,
              );
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

function readAdditionalCode(storageDir: string): AdditionalCode {
  let readme;
  let mainCode;
  try {
    readme = readme2Html(path.join(storageDir, 'package', 'README.md'));
  } catch (error) {
    readme = undefined;
  }
  try {
    mainCode = readMainCode(path.join(storageDir, 'package'));
  } catch (error) {
    mainCode = undefined;
  }
  return {
    readme,
    mainCode,
  };
}

function getDistTags({ scope, packageName }: PackageId): AxiosPromise<any> {
  return process.env.MOCK
    ? new Promise<AxiosResponse>((resolve, reject) => {
        resolve(
          createAxiosResponse({
            latest: '1.1.0',
          }),
        );
      })
    : axios.get(`/-/package/${name2url({ scope, packageName })}/dist-tags`);
}

export default {
  fetchPackages,
  getDistTags,
  getPackageDetail,
  baseURL: axios.defaults.baseURL,
};
