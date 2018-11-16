import axios, { AxiosInstance, AxiosPromise } from 'axios';
import { PackagesResponse } from '../../types/PackageResponse';
import { PackageMetaDataDTO } from '../../types/package-meta-data';
import { IPackageJSON } from '../../types/package-json';
import Config from '../../types/Config';
import PackageId from '../../types/PackageId';

export default class BackendApi {
  private static instance: BackendApi;
  private axios: AxiosInstance;
  private baseURL: string;

  private constructor() {
    let cloudPort;
    try {
      cloudPort = require('../../.backend').port;
    } catch (e) {
      cloudPort = undefined;
    }
    this.baseURL = `//${document.location ? document.location.hostname : 'localhost'}:${cloudPort ||
      '30001'}`;
    this.axios = axios.create({
      baseURL: this.baseURL,
    });
  }

  public static get Instance(): BackendApi {
    return this.instance || (this.instance = new this());
  }

  public getBaseURL(): string {
    return this.baseURL;
  }

  public getPackages(): AxiosPromise<PackagesResponse> {
    return this.get('packages');
  }

  public getConfig(): AxiosPromise<Config> {
    return this.get('config');
  }

  public getPackageDetail({
    scope,
    packageName,
    version,
  }: PackageId): AxiosPromise<PackageMetaDataDTO> {
    return this.get(`packageDetail/${scope}/${packageName}${version ? `/${version}` : ''}`);
  }

  public getFileContent(
    packageId: PackageId,
    filepath: string,
    format: string = 'string',
  ): AxiosPromise<string> {
    return this.get(
      `packageDetail/${packageId.scope}/${packageId.packageName}${
        packageId.version ? `/${packageId.version}` : ''
      }/files/${filepath}?format=${format}`,
    );
  }

  public getMetaInfo(): AxiosPromise<IPackageJSON> {
    return this.get(`meta`);
  }

  private get(route: string): AxiosPromise<any> {
    return this.axios.get(route);
  }
}
