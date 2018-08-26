import axios, { AxiosInstance, AxiosPromise } from 'axios';
import { PackagesResponse } from '@/model/PackageResponse';
import { PackageMetaDataDTO } from '@/model/package-meta-data';
import { IPackageJSON } from '@/model/package-json';
import Config from '@/model/Config';

export default class BackendApi {

  private static instance: BackendApi;
  private axios: AxiosInstance;
  private baseURL: string;

  private constructor() {
    this.baseURL = `//${document.location.hostname}:30001`;
    this.axios = axios.create({
      baseURL: this.baseURL,
    });
  }

  public static get Instance(): BackendApi {
    return this.instance || (this.instance = new this());
  }

  public getPackages(): AxiosPromise<PackagesResponse> {
    return this.get('packages');
  }

  public getConfig(): AxiosPromise<Config> {
    return this.get('config');
  }

  public getPackageDetail({scope, packageName}): AxiosPromise<PackageMetaDataDTO> {
    return this.get(`packageDetail/${scope ? `${scope}/` : ''}${packageName}`);
  }

  public getMetaInfo(): AxiosPromise<IPackageJSON> { // TODO: #2 add service with frontend cache
    return this.get(`meta`);
  }

  private get(route: string): AxiosPromise<any> {
    return this.axios.get(route);
  }

}
