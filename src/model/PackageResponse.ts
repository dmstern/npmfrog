import { PackageMetaDataDTO } from '@/model/package-meta-data';

export interface PackagesResponse {
  [key: string]: PackageMetaDataDTO;
}
