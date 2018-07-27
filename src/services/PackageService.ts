import Api from '@/services/Api';
import { AxiosPromise } from 'axios';
import { PackagesResponse } from '@/api/PackageResponse';
import { resolve } from 'url';

export default class PackagesService {

  public static get Instance(): PackagesService {
    return this.instance || (this.instance = new this());
  }

  private static instance: PackagesService;

  private request!: Promise<PackagesResponse>;
  private packages!: PackagesResponse;

  public async getPackages(): Promise<PackagesResponse> {
    if (this.packages) {
      return new Promise<PackagesResponse>((fulfill, reject) => {
        fulfill(this.packages);
      });
    }

    if (this.request) {
      return this.request;
    }
    this.request = this.fetchPackages().then((response) => {
      const packagesResponse: PackagesResponse = response.data;
      const packageNames: any[] = Object.keys(packagesResponse).filter((key) => !key.startsWith('_'));

      const packages: PackagesResponse = {};
      for (const packageName of packageNames) {
        let displayName: any = '';
        if (packagesResponse[packageName].author) {
          displayName = packagesResponse[packageName].author!.name
            ? packagesResponse[packageName].author!.name
            : packagesResponse[packageName].author;
        }
        Object.assign(packagesResponse[packageName], {displayName});
        packages[packageName] = packagesResponse[packageName];
      }
      this.packages = packages;
      return packages;
    });
    return this.request;
  }

  private fetchPackages(): AxiosPromise<PackagesResponse> {
    return Api.Instance.get('packages');
  }
}
