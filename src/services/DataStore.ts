import BackendApi from '@/services/BackendApi';
import { PackagesResponse } from '../../types/PackageResponse';
import Package from '../../types/Package';
import { Tag } from '../../types/Tag';
import { PackageMetaDataDTO } from '../../types/package-meta-data';
import Crafter from '../../types/Crafter';
import Searchable from '../../types/Searchable';
import { IPackageJSON } from '../../types/package-json';
import Config from '../../types/Config';
import { EventBus, Errors } from '@/services/event-bus';
import PackageId from 'types/PackageId';

export default class DataStore {
  public static get Instance(): DataStore {
    return this.instance || (this.instance = new this());
  }

  public get searchItems(): Searchable[] {
    return this.tagList;
  }

  public get crafters(): Crafter[] {
    return this.crafterList;
  }

  private static instance: DataStore;

  private request!: Promise<Package[]>;
  private packages!: Package[];
  private tagList!: Tag[];
  private crafterList!: Crafter[];
  private packageDetails!: {
    [packageName: string]: {
      packageDetail: Package;
      currentPackage?: Package;
    };
  };
  private metaInfo!: IPackageJSON;
  private config!: Config;

  private constructor() {
    this.packages = [];
    this.tagList = [];
    this.crafterList = [];
    this.packageDetails = {};
  }

  public async getPackageDetail(packageId: PackageId): Promise<{
    packageDetail: Package;
    currentPackage?: Package;
  }> {
    const scope = packageId.scope;
    const packageName = packageId.packageName;
    const version = packageId.version;
    const key = `${scope ? `${scope}/${packageName}` : packageName}@${version}`;
    const cachedPackageDetails = this.packageDetails[key];
    if (cachedPackageDetails) {
      return new Promise<{
        packageDetail: Package;
        currentPackage?: Package;
      }>((fulfill) => {
        fulfill(cachedPackageDetails);
      });
    }

    return new Promise<{
      packageDetail: Package;
      currentPackage?: Package;
    }>((fulfill) => {
      BackendApi.Instance.getPackageDetail({ scope, packageName, version })
        .then((response) => {
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
        })
        .catch((error) => {
          EventBus.$emit(Errors.SERVER_ERROR, error);
          return null;
        });
    });
  }

  public async getPackages(): Promise<Package[]> {
    if (this.packages.length) {
      return new Promise<Package[]>((resolve) => {
        resolve(this.packages);
      });
    }

    if (this.request) {
      return this.request;
    }
    return (this.request = BackendApi.Instance.getPackages()
      .then((response) => {
        const packagesResponse: PackagesResponse = response.data;

        for (const packageName of Object.keys(packagesResponse).filter(
          (key) => !key.startsWith('_'),
        )) {
          const modifiedPackage: Package = new Package(
            packagesResponse[packageName],
          );
          this.packages.push(modifiedPackage);

          if (modifiedPackage.tags) {
            for (const tag of modifiedPackage.tags) {
              if (
                !this.tagList.some((currentTag) => tag.value === currentTag.value)
              ) {
                this.tagList.push(tag);
              }
            }
          }
          for (const crafter of modifiedPackage.crafters) {
            if (
              !this.crafterList.some((currentCrafter) =>
                currentCrafter.equals(crafter),
              )
            ) {
              this.crafterList.push(crafter);
            }
          }
        }
        return this.packages;
      })
      .catch((error) => {
        EventBus.$emit(Errors.SERVER_ERROR, error);
        return [];
      }));
  }

  public getConfig(): Promise<Config | undefined> {
    if (this.config) {
      return new Promise((resolve, reject) => {
        resolve(this.config);
      });
    }
    return BackendApi.Instance.getConfig()
      .then((response) => {
        this.config = response.data;
        return this.config;
      })
      .catch((error) => {
        EventBus.$emit(Errors.SERVER_ERROR, error);
        return undefined;
      });
  }

  public getMetaInfo(): Promise<IPackageJSON | undefined> {
    if (this.metaInfo) {
      return new Promise((resolve, reject) => {
        resolve(this.metaInfo);
      });
    }
    return BackendApi.Instance.getMetaInfo()
      .then((response) => {
        this.metaInfo = response.data;
        return this.metaInfo;
      })
      .catch((error) => {
        EventBus.$emit(Errors.SERVER_ERROR, error);
        return undefined;
      });
  }
}
