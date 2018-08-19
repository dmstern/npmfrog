import Package from '@/model/Package';
import { PackageDetailsDTO } from '@/model/package-datails.dto';

export default class PackageDetails extends Package {

  constructor(packageDetails: PackageDetailsDTO) {
    super(packageDetails);
  }
}
