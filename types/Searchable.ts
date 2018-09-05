import Package from './Package';

export default abstract class Searchable {
  public abstract matches(other: Searchable, packages: Package[]): boolean;

  public abstract getSearchItemText(): string[];

  public matchesPattern(pattern: RegExp): boolean {
    return this.getSearchItemText().some((text) => {
      console.log(text, pattern);
      return text.match(pattern) !== null;
    });
  }
}
