import { PackageAbstract } from '@/model/package-abstract';
import {
  IAuthor,
  IBinMap,
  IBugs,
  IConfig,
  IDependencyMap,
  IDirectories,
  IEngines,
  IPublishConfig,
  IRepository,
  IScriptsMap,
} from '@/model/package-json';
import { IDistTags, ITimes } from '@/model/package-abstract';
import { PackageMetaDataDTO } from '@/model/package-meta-data';

export default class Package implements PackageMetaDataDTO {
  public distTags!: IDistTags;
  public time!: ITimes;
  public users!: {};
  public versions!: {
    [key: number]: string;
  };
  // tslint:disable-next-line:variable-name
  public _id!: string;
  // tslint:disable-next-line:variable-name
  public _rev!: string;
  public name!: string;
  public version?: string | undefined;
  public description?: string | undefined;
  public keywords?: string[] | undefined;
  public homepage?: string | undefined;
  public bugs?: string | IBugs;
  public license?: string | undefined;
  public author?: IAuthor;
  public contributors?: string[] | IAuthor[];
  public files?: string[] | undefined;
  public main?: string | undefined;
  public bin?: string | IBinMap;
  public man?: string | string[] | undefined;
  public directories?: IDirectories;
  public repository?: string | IRepository;
  public scripts?: IScriptsMap;
  public config?: IConfig;
  public dependencies?: IDependencyMap;
  public devDependencies?: IDependencyMap;
  public peerDependencies?: IDependencyMap;
  public optionalDependencies?: IDependencyMap;
  public bundledDependencies?: string[] | undefined;
  public engines?: IEngines;
  public os?: string[] | undefined;
  public cpu?: string[] | undefined;
  public preferGlobal?: boolean | undefined;
  public private?: boolean | undefined;
  public publishConfig?: IPublishConfig;
  public displayName: any;

  constructor(packageDetails: PackageAbstract);

  constructor(packageMetaData: PackageMetaDataDTO) {
    Object.assign(this, packageMetaData);

    if (packageMetaData.author) {
      this.displayName = packageMetaData.author!.name
        ? packageMetaData.author!.name
        : packageMetaData.author;
    }
    Object.assign(this, { displayName: this.displayName });
  }

}
