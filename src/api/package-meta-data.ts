import { IPackageJSON } from '@/api/package-json';

export interface PackageMetaData extends IPackageJSON {

  readonly distTags: IDistTags;
  readonly time: ITimes;
  readonly users: {};
  readonly versions: IVersions;
  readonly _id: string;
  readonly _rev: string;
}

export interface ITimes {
  [key: number]: Date;
  created: string;
  modified: string;
}

export interface IVersions {
  [key: number]: string;
}

export interface IDistTags {
  [key: string]: number;
}
