import BackendApi from '@/services/BackendApi';
import { PackagesResponse } from '@/model/PackageResponse';
import Package from '@/model/Package';
import { SearchItem } from '@/model/SearchItem';
import { PackageMetaDataDTO } from '@/model/package-meta-data';
import Crafter from '@/model/Crafter';
import SearchComparable from '@/model/SearchComparable';

export default class PackagesService {
  public static get Instance(): PackagesService {
    return this.instance || (this.instance = new this());
  }

  public get searchItems(): SearchComparable[] {
    return this.searchItemList;
  }

  public get crafters(): Crafter[] {
    return this.crafterList;
  }

  private static instance: PackagesService;

  private request!: Promise<Package[]>;
  private packages!: Package[];
  private searchItemList!: SearchItem[];
  private crafterList!: Crafter[];
  private packageDetails!: {
    [packageName: string]: {
      packageDetail: Package,
      currentPackage?: Package,
    },
  };

  private constructor() {
    this.packages = [];
    this.searchItemList = [];
    this.crafterList = [];
    this.packageDetails = {};
  }

  public async getPackageDetail(packageId: {scope: string, packageName: string}): Promise<{
    packageDetail: Package,
    currentPackage?: Package,
  }> {
    const scope = packageId.scope;
    const packageName = packageId.packageName;
    const key = scope ? `${scope}/${packageName}` : packageName;
    const cachedPackageDetails = this.packageDetails[key];
    if (cachedPackageDetails) {
      return new Promise<{
        packageDetail: Package,
        currentPackage?: Package,
      }>((fulfill) => {
        fulfill(cachedPackageDetails);
      });
    }

    return new Promise<{
      packageDetail: Package,
      currentPackage?: Package,
    }>((fulfill) => {
      BackendApi.Instance.getPackageDetail({scope, packageName}).then((response) => {
        const packageDetail: Package = new Package(response.data);
        let currentPackage: Package | undefined;
        const currentVersionObject: string | PackageMetaDataDTO =
          packageDetail.versions[packageDetail['dist-tags'].latest];
        if (typeof currentVersionObject !== 'string') {
          currentPackage = new Package(currentVersionObject);
        }
        this.packageDetails[key] = {
          packageDetail,
          currentPackage,
        };
        return fulfill(this.packageDetails[key]);
      });
    });
  }

  public async getPackages(): Promise<Package[]> {
    if (this.packages.length) {
      return new Promise<Package[]>((fulfill) => {
        fulfill(this.packages);
      });
    }

    if (this.request) {
      return this.request;
    }
    return (this.request = new Promise<Package[]>((fulfill, reject) => {
      BackendApi.Instance.getPackages().then((response) => {
        const packagesResponse: PackagesResponse = response.data;

        for (const packageName of Object.keys(packagesResponse).filter((key) => !key.startsWith('_'))) {
          const modifiedPackage: Package = new Package(packagesResponse[packageName]);
          this.packages.push(modifiedPackage);

          if (modifiedPackage.keywords) {
            for (const keyword of modifiedPackage.keywords!) {
              if (! this.searchItemList.some((currentSearchItem) => keyword === currentSearchItem.value)) {
                this.searchItemList.push(new SearchItem(keyword));
              }
            }
          }
          for (const crafter of modifiedPackage.crafters) {
            if (! (this.crafterList.some((currentCrafter) => currentCrafter.equals(crafter)))) {
              this.crafterList.push(crafter);
            }
          }
        }
        fulfill(this.packages);
      }).catch((error) => {
        reject(error);
      });
    }));
  }

}
