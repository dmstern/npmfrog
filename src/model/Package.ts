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
import Crafter from '@/model/Crafter';
import SearchComparable from '@/model/SearchComparable';
import { SearchItem } from '@/model/SearchItem';

export default class Package implements PackageMetaDataDTO, SearchComparable  {
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
  public readonly author?: IAuthor | string;
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

  public matches(other: SearchComparable): boolean {
    if (other instanceof SearchItem) {
      return this.keywords !== undefined && this.keywords.indexOf(other.value) > -1;
    }
    if (other instanceof Crafter) {
      return this.crafters.some((crafter) => crafter.equals(other));
    }
    if (other instanceof Package) {
      return other.name === this.name && other.version === this.version;
    }
    return false;
  }

  public get crafters(): Crafter[] {
    const crafters: Crafter[] = [];
    const author: Crafter | undefined = new Crafter(this.author);
    if (author) {
      crafters.push(author);
    }
    if (this.contributors) {
      const contributors: Crafter[] = this.multipleAuthors2Crafaters(this.contributors);
      if (contributors.some((contributor) => {
        return contributor.equals(author);
      })) {
        return contributors;
      }
      return crafters.concat(contributors);
    }
    return crafters;
  }

  public matchesCrafter(pattern: RegExp): boolean {
    for (const crafter of this.crafters) {
      if (crafter.name) {
        if (
          crafter.name.match(pattern) ||
          `crafter:${crafter.name}`.match(pattern) ||
          `author:${crafter.name}`.match(pattern)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private multipleAuthors2Crafaters(authors: Array<IAuthor | string>): Crafter[] {
    const crafters: Crafter[] = [];
    for (const author of authors) {
      const crafter = new Crafter(author);
      if (crafter) {
        crafters.push(crafter);
      }
    }
    return crafters;
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
