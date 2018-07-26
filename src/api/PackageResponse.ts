import { PackageMetaData } from '@/api/package-meta-data';

export interface PackagesResponse {
  [key: string]: PackageMetaData;
}
