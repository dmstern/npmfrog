import Api from '@/services/Api';
import { AxiosPromise } from 'axios';

export default class PackagesService {

  public static fetchPackages(): AxiosPromise<string> {
    return new Api().get('packages');
  }
}
