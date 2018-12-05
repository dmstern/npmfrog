import { IPackageJSON } from './package-json';

export interface PackageMetaDataDTO extends IPackageJSON {
  readonly distTags: IDistTags;
  readonly time: ITimes;
  readonly users: {};
  readonly _id: string;
  readonly _rev: string;
  readonly _isCached?: boolean;
}

export interface ITimes {
  [key: number]: Date;
  created: string;
  modified: string;
}

export interface IDistTags {
  [key: string]: string;
}

export interface IVersions {
  [key: string]: string | PackageMetaDataDTO;
}
