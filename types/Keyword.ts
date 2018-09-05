import Searchable from './Searchable';
import Package from './Package';
export class Keyword implements Searchable {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }

  public matches(other: Searchable, packages: Package[]): boolean {
    if (other instanceof Keyword && other.value === this.value) {
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

  public getSearchItemText(): string[] {
    return [
      `#${this.value}`,
      `keyword:${this.value}`,
      `tag:${this.value}`,
    ];
  }
}
