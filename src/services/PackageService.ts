import Api from '@/services/Api';
import { AxiosPromise } from 'axios';
import { PackagesResponse } from '@/model/PackageResponse';
import Package from '@/model/Package';
import { SearchItem, SearchKey } from '@/model/SearchItem';

export default class PackagesService {
  public static get Instance(): PackagesService {
    return this.instance || (this.instance = new this());
  }

  public get response(): PackagesResponse {
    return this.packagesResponse;
  }

  public get packageNames(): string[] {
    return this.packageNamesList;
  }

  public get searchItems(): Array<string|{}> {
    return this.searchItemList;
  }

  private static instance: PackagesService;

  private request!: Promise<Package[]>;
  private packages!: Package[];
  private packagesResponse!: PackagesResponse;
  private packageNamesList!: string[];
  private searchItemList!: Array<string|{}>;

  constructor() {
    this.packages = [];
    this.packageNamesList = [];
    this.searchItemList = [];
  }

  public addSearchItem(searchItem: SearchItem) {
    this.searchItemList.push(searchItem);
  }

  public async getPackages(): Promise<Package[]> {
    if (this.packages.length) {
      return new Promise<Package[]>((fulfill, reject) => {
        fulfill(this.packages);
      });
    }

    if (this.request) {
      return this.request;
    }
    return (this.request = new Promise<Package[]>((fulfill, reject) => {
      this.fetchPackages().then((response) => {
        const packagesResponse: PackagesResponse = response.data;
        this.packageNamesList = Object.keys(packagesResponse).filter(
          (key) => !key.startsWith('_'),
        );

        for (const packageName of this.packageNamesList) {
          const modifiedPackage: Package = new Package(
            packagesResponse[packageName],
          );
          this.packages.push(modifiedPackage);

          this.addSearchItem(new SearchItem(SearchKey.name, packageName));
          if (modifiedPackage.keywords) {
            for (const keyword of modifiedPackage.keywords!) {
              this.addSearchItem(new SearchItem(SearchKey.keyword, keyword));
            }
          }
          if (modifiedPackage.displayName) {
            this.addSearchItem(new SearchItem(SearchKey.author, modifiedPackage.displayName));
          }
        }
        this.packagesResponse = packagesResponse;
        fulfill(this.packages);
      });
    }));
  }

  private fetchPackages(): AxiosPromise<PackagesResponse> {
    return Api.Instance.get('packages');
  }
}
