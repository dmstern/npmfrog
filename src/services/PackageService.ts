import Api from '@/services/Api';
import { AxiosPromise } from 'axios';
import { PackagesResponse } from '@/api/PackageResponse';

export default class PackagesService {

  public static fetchPackages(): AxiosPromise<PackagesResponse> {
    return Api.Instance.get('packages');
  }

  public static async getPackages() {
    return this.fetchPackages().then((response) => {
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
      return packages;
    });
  }
}
