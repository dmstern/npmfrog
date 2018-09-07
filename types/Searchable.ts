import Package from './Package';

export default abstract class Searchable {
  public abstract matches(other: Searchable, packages: Package[]): boolean;

  public abstract getSearchItemText(): string[];

  public matchesPattern(pattern: string): boolean {
    return this.getSearchItemText().some((text) => text.toLowerCase().includes(pattern.toLowerCase()));
  }

  public abstract toString(): string;
}
