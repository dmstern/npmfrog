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
import { IDistTags, ITimes, IVersions } from '@/model/package-meta-data';
import { PackageMetaDataDTO } from '@/model/package-meta-data';

export default class Package implements PackageMetaDataDTO {
  public readonly distTags!: IDistTags;
  public readonly time!: ITimes;
  public readonly users!: {};
  public readonly versions!: IVersions;
  // tslint:disable-next-line:variable-name
  public readonly _id!: string;
  // tslint:disable-next-line:variable-name
  public readonly _rev!: string;
  public readonly name!: string;
  public readonly version?: string | undefined;
  public readonly description?: string | undefined;
  public readonly keywords?: string[] | undefined;
  public readonly homepage?: string | undefined;
  public readonly bugs?: string | IBugs;
  public readonly license?: string | undefined;
  public readonly author?: IAuthor;
  public readonly contributors?: string[] | IAuthor[];
  public readonly files?: string[] | undefined;
  public readonly main?: string | undefined;
  public readonly bin?: string | IBinMap;
  public readonly man?: string | string[] | undefined;
  public readonly directories?: IDirectories;
  public readonly repository?: string | IRepository;
  public readonly scripts?: IScriptsMap;
  public readonly config?: IConfig;
  public readonly dependencies?: IDependencyMap;
  public readonly devDependencies?: IDependencyMap;
  public readonly peerDependencies?: IDependencyMap;
  public readonly optionalDependencies?: IDependencyMap;
  public readonly bundledDependencies?: string[] | undefined;
  public readonly engines?: IEngines;
  public readonly os?: string[] | undefined;
  public readonly cpu?: string[] | undefined;
  public readonly preferGlobal?: boolean | undefined;
  public readonly private?: boolean | undefined;
  public readonly publishConfig?: IPublishConfig;
  public readonly displayName?: string;
  public readonly readme?: string | null;
  public readonly repositoryUrl?: string;
  public readonly bugTrackerUrl?: string;
  public readonly dependenciesCount: number;
  public readonly scope: string | undefined;
  public readonly mainCode: string | undefined;

  constructor(packageMetaData: PackageMetaDataDTO) {
    Object.assign(this, packageMetaData);

    if (!this.distTags) {
      this.distTags = packageMetaData['dist-tags'];
    }

    // handle different types of author:
    if (packageMetaData.author) {
      if (typeof packageMetaData.author === 'string') {
        const authorParts = packageMetaData.author.split('<');
        if (authorParts.length === 2) {
          const name = authorParts[0];
          const email = authorParts[1].slice(0, authorParts[1].length - 1);
          this.author = {
            name,
            email,
          };
          this.displayName = name;
        } else {
          this.displayName = packageMetaData.author;
        }
      } else {
        this.displayName = packageMetaData.author.name;
      }
    } else {
      this.displayName = packageMetaData.author;
    }

    // set repositoryUrl:
    if (packageMetaData.repository) {
      if (typeof packageMetaData.repository === 'string') {
        this.repositoryUrl = packageMetaData.repository;
      } else {
        this.repositoryUrl = packageMetaData.repository.url;
      }
    }

    // set bugsUrl:
    if (packageMetaData.bugs) {
      if (typeof packageMetaData.bugs === 'string') {
        this.bugTrackerUrl = packageMetaData.bugs;
      } else {
        this.bugTrackerUrl = packageMetaData.bugs.url;
      }
    }

    // Count depenedencies:
    const dependencies = packageMetaData.dependencies;
    const devDependencies = packageMetaData.devDependencies;
    const dependenciesCount = dependencies ? Object.keys(dependencies).length : 0;
    const devDependenciesCount = devDependencies ? Object.keys(devDependencies).length : 0;
    this.dependenciesCount = dependenciesCount + devDependenciesCount;

    // set scope:
    const packageNameParts = packageMetaData.name.split('/');
    if (packageNameParts.length > 1) {
      this.scope = packageNameParts[0];
    }
  }

  public get repositoryName(): string | undefined {
    if (this.repositoryUrl) {
      return this.url2Name(this.repositoryUrl);
    }
  }

  public get bugTrackerName(): string | undefined {
    if (this.bugTrackerUrl) {
      return this.url2Name(this.bugTrackerUrl);
    }
  }

  private url2Name(url: string): string {
    if (url.includes('github')) {
      return 'github';
    }
    if (url.includes('gitlab')) {
      return 'gitlab';
    }
    return url.split('/')[2];
  }

}
