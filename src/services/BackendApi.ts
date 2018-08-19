import axios, { AxiosInstance, AxiosPromise } from 'axios';
import { PackagesResponse } from '@/model/PackageResponse';

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

  private get(route: string): AxiosPromise<PackagesResponse> {
    return this.axios.get(route);
  }

}
