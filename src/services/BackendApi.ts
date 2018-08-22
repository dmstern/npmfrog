import axios, { AxiosInstance, AxiosPromise } from 'axios';
import { PackagesResponse } from '@/model/PackageResponse';
import { PackageMetaDataDTO } from '@/model/package-meta-data';

export default class BackendApi {

  private static instance: BackendApi;
  private axios: AxiosInstance;

  private constructor() {
    this.axios = axios.create({
      baseURL: `http://localhost:30001`,
    });
  }

  public static get Instance(): BackendApi {
    return this.instance || (this.instance = new this());
  }

  public getPackages(): AxiosPromise<PackagesResponse> {
    return this.get('packages');
  }

  public getConfig(): AxiosPromise<any> {
    return this.get('config');
  }

  public getPackageDetail({scope, packageName}): AxiosPromise<PackageMetaDataDTO> {
    return this.get(`packageDetail/${scope ? `${scope}/` : ''}${packageName}`);
  }

  private get(route: string): AxiosPromise<any> {
    return this.axios.get(route);
  }

}
