import axios, { AxiosResponse, AxiosPromise } from 'axios';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as tar from 'tar';
import * as showdown from 'showdown';
import * as emoji from 'node-emoji';
import { PackagesResponse } from '../types/PackageResponse';
import PackageId from '../types/PackageId';
import getFiles from './fileLister';
import * as os from 'os';

import configService from './config-service.js';

let instance;

const tmpDir = path.join(os.homedir(), '.npmfrog', 'package-cache');
const packageDetailCache = {};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

interface AdditionalCode {
  readme: string;
  fileList;
}

class ArtifactoryService {
  public baseURL: string;

  constructor() {
    if (instance) {
      return instance;
    }
    configService
      .getConfig()
      .then(config => {
        const repoKey = config.artifactory.repoKey;
        const s = config.artifactory.https ? 's' : '';

        axios.defaults.baseURL = this.baseURL = `http${s}://${
          config.artifactory.host
        }/artifactory/api/npm/${repoKey}`;
        axios.defaults.headers.common.Authorization = config.artifactory.apiKey;
      })
      .catch(error => {
        console.error(error);
      });
    instance = this;
  }

  public fetchPackages(): AxiosPromise<PackagesResponse> {
    if (process.env.MOCK) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        resolve(
          this.createAxiosResponse(
            fs.readJSONSync(path.join(__dirname, 'mock', 'packages-all.json')),
          ),
        );
      });
    }
    return axios.get(`/-/all`);
  }

  public async getPackageDetail({
    scope,
    packageName,
    version,
  }: PackageId): Promise<AxiosResponse> {
    const latestVersionResponse = await this.getDistTags({ scope, packageName });
    const currentVersion = version || latestVersionResponse.data.latest;
    const key = `${scope}-${packageName}-${currentVersion}`;

    const packageDetailResponse: AxiosResponse = process.env.MOCK
      ? await new Promise<AxiosResponse>((resolve, reject) => {
          const packageResource = path.join(__dirname, 'mock', `${packageName}.json`);
          let data;
          try {
            data = fs.readJSONSync(packageResource);
          } catch (error) {
            data = fs.readJSONSync(path.join(__dirname, 'mock', 'module-enhancer-script.json'));
          }
          resolve(this.createAxiosResponse(data));
        })
      : packageDetailCache[key]
        ? await new Promise<AxiosResponse>((resolve, reject) => {
            resolve(this.createAxiosResponse(packageDetailCache[key]));
          })
        : await axios.get(`/${this.name2url({ scope, packageName })}`);

    const additionalCode: AdditionalCode = process.env.MOCK
      ? await new Promise<AdditionalCode>(resolve => {
          const packageResource = path.join(__dirname, 'mock', `${packageName}.readme.md`);
          let data;
          try {
            data = this.readme2Html(packageResource);
          } catch (error) {
            data = this.readme2Html(
              path.join(__dirname, 'mock', 'module-enhancer-script.readme.md'),
            );
          }
          resolve({
            readme: data,
            fileList: [],
          });
        })
      : await new Promise<AdditionalCode>(async (resolve, reject) => {
          const packageDetail = packageDetailResponse.data;
          const downloadUrl = packageDetail.versions[currentVersion].dist.tarball;
          const storageDir = path.join(tmpDir, scope, packageName, currentVersion);
          if (fs.existsSync(storageDir)) {
            this.readAdditionalCode(storageDir).then(response => {
              resolve(response);
            });
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
              .then(result => {
                fs.ensureDirSync(storageDir);
                const outputFilename = path.join(
                  storageDir,
                  `${packageName}-${currentVersion}.tar.gz`,
                );
                fs.writeFileSync(outputFilename, result.data);
                return outputFilename;
              })
              // Extract package:
              .then(file => {
                const cwd = storageDir;
                return tar.x({ file, cwd }).then(() => cwd);
              })
              .then(dir => {
                this.readAdditionalCode(dir).then(response => {
                  resolve(response);
                });
              });
          }
        });

    Object.assign(packageDetailResponse.data, additionalCode);

    return new Promise<AxiosResponse>((resolve, reject) => {
      packageDetailCache[key] = packageDetailResponse.data;
      resolve(packageDetailResponse);
    });
  }

  public getDistTags({ scope, packageName }: PackageId): AxiosPromise<any> {
    return process.env.MOCK
      ? new Promise<AxiosResponse>((resolve, reject) => {
          resolve(
            this.createAxiosResponse({
              latest: '1.1.0',
            }),
          );
        })
      : axios.get(`/-/package/${this.name2url({ scope, packageName })}/dist-tags`);
  }

  public async getFileContent(
    packageId: PackageId,
    filepath: string,
    format: string = 'string',
  ): Promise<string | Buffer> {
    const absPath = path.join(
      tmpDir,
      packageId.scope,
      packageId.packageName,
      packageId.version,
      'package',
      filepath,
    );
    const fileContent = fs.readFileSync(absPath);
    console.log(format === 'string');
    return format === 'string' ? fileContent.toString() : fileContent;
  }

  private name2url({ scope, packageName }: PackageId): string {
    return `${scope && scope !== 'undefined' ? `${scope}/` : ''}${packageName}`;
  }

  private createAxiosResponse(data: any): AxiosResponse<any> {
    return {
      data,
      status: 200,
      config: undefined,
      headers: undefined,
      request: undefined,
      statusText: undefined,
    };
  }

  private readme2Html(readmeFile: string): string {
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

  private async readAdditionalCode(storageDir: string): Promise<AdditionalCode> {
    let readme;
    let fileList;
    try {
      readme = this.readme2Html(path.join(storageDir, 'package', 'README.md'));
    } catch (error) {
      readme = undefined;
    }
    try {
      fileList = await getFiles(storageDir, 'package', false);
    } catch {
      fileList = [];
    }
    return {
      readme,
      fileList,
    };
  }
}

export default new ArtifactoryService();
