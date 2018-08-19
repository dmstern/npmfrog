import BackendApi from '@/services/BackendApi';
import Package from '@/model/Package';
import { PackageDetails } from '@/model/PackageDetails';

export default class PackagesDetailService {
  public static get Instance(): PackagesDetailService {
    return this.instance || (this.instance = new this());
  }

  private static instance: PackagesDetailService;

  private packageDetails!: {
    [packageName: string]: PackageDetails;
  };

  private constructor() {
  }

  public async getPackageDetail(packageName: string): Promise<Package[]> {
  }

}
