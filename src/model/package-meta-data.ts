import { PackageAbstract } from '@/model/package-abstract';

export interface PackageMetaDataDTO extends PackageAbstract {

  readonly versions: {
    [key: number]: string;
  };
}
