import Searchable from './Searchable';
import Package from './Package';
export class Tag extends Searchable {
  public static allTags: Tag[] = [];
  public value: string;

  constructor(value: string) {
    super();
    this.value = value;
    const alreadyCreatedTag = Tag.allTags.find((tag) => tag.value === this.value);
    if (alreadyCreatedTag) {
      return alreadyCreatedTag;
    } else {
      Tag.allTags.push(this);
    }
  }

  public matches(other: Searchable, packages: Package[]): boolean {
    if (other instanceof Tag && other.value === this.value) {
      return true;
    }
    if (
      other instanceof Package &&
      other.tags !== undefined &&
      other.tags.some((tag) => tag.value === this.value)
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

  public toString(): string {
    return this.value;
  }

  public getSearchItemText(): string[] {
    return [`#${this.value}`, `keyword:${this.value}`, `tag:${this.value}`];
  }
}
