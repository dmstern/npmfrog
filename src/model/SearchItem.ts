import SearchComparable from '@/model/SearchComparable';
import Crafter from '@/model/Crafter';
import Package from '@/model/Package';
// TODO: can this be removed?. it's not needed anymore since there are only keywords left.
export class SearchItem implements SearchComparable {
  public key: SearchKey;
  public value: string;

  constructor(key: SearchKey, value: string) {
    this.key = key;
    this.value = value;
  }

  public matches(other: SearchComparable, packages: Package[]): boolean {
    if (other instanceof SearchItem) {
      return other.key === this.key && other.value === this.value;
    }
    if (other instanceof Crafter) {
      for (const item of packages) {
        if (item.matches(this) && item.matches(other)) {
          return true;
        }
      }
    }
    if (other instanceof Package) {
      return other.keywords !== undefined && other.keywords.some((keyword) => keyword === this.value);
    }
    return false;
  }
}

export enum SearchKey {
  KEYWORD = 'keyword',
  AUTHOR = 'crafter',
  TEXT = 'text',
}
