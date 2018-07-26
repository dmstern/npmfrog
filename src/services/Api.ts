import axios, { AxiosInstance, AxiosPromise } from 'axios';

export default class Api {

  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: `http://localhost:30001`,
    });
  }

  public get(route: string): AxiosPromise<any> {
    return this.axios.get(route);
  }
}
