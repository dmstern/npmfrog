import axios, { AxiosInstance, AxiosPromise } from 'axios';

export default class Api {

  private static instance: Api;
  private axios: AxiosInstance;

  private constructor() {
    this.axios = axios.create({
      baseURL: `http://localhost:30001`,
    });
  }

  public static get Instance(): Api {
    return this.instance || (this.instance = new this());
  }

  public get(route: string): AxiosPromise<any> {
    return this.axios.get(route);
  }
}
