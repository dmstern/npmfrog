import { PackageMetaDataDTO } from '@/model/package-meta-data';
import { PackageAbstract } from '@/model/package-abstract';

export interface PackageDetailsDTO extends PackageAbstract {

  readonly versions: {
    [key: number]: PackageMetaDataDTO,
  };
  readonly readme: string;
}
