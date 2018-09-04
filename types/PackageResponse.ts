import { PackageMetaDataDTO } from './package-meta-data';

export interface PackagesResponse {
  [key: string]: PackageMetaDataDTO;
}
