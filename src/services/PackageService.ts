import Api from '@/services/Api';
import { AxiosPromise } from 'axios';
import { PackagesResponse } from '@/api/PackageResponse';

export default class PackagesService {

  public static fetchPackages(): AxiosPromise<PackagesResponse> {
    return new Api().get('packages');
  }
}
