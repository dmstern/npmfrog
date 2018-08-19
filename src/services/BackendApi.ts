import axios, { AxiosInstance, AxiosPromise } from 'axios';
import { PackagesResponse } from '@/model/PackageResponse';
import Package from '@/model/Package';

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

  public getPackageDetail({scope, packageName}): AxiosPromise<Package> {
    return this.get(`${scope ? `${scope}/` : ''}${packageName}`);
  }

  private get(route: string): AxiosPromise<any> {
    return this.axios.get(route);
  }

}
