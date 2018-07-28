import { PackageMetaData } from '@/model/package-meta-data';

export interface PackagesResponse {
  [key: string]: PackageMetaData;
}
