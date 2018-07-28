export class SearchItem {
  public key: SearchKey;
  public searchString: string;
  public displayString: string;

  constructor(key: SearchKey, value: string) {
    this.key = key;
    this.displayString = value;
    this.searchString = `${this.key}: ${this.displayString}`;
  }
}

export enum SearchKey {
  keyword = 'keyword',
  author = 'author',
  name = 'name',
}
