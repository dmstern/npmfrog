import SearchComparable from './SearchComparable';
import Package from './Package';
export class SearchItem implements SearchComparable {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }

  public matches(other: SearchComparable, packages: Package[]): boolean {
    if (other instanceof SearchItem && other.value === this.value) {
      return true;
    }
    if (
      other instanceof Package
      && other.keywords !== undefined
      && other.keywords.some((keyword) => keyword === this.value)
    ) {
      return true;
    }
    for (const item of packages) {
      if (item.matches(this) && item.matches(other)) {
        return true;
      }
    }
    return false;
  }
}
