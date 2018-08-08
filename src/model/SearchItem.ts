export class SearchItem {
  public key: SearchKey;
  public displayString: string;
  private searchStringProp: string;

  constructor(key: SearchKey, value: string) {
    this.key = key;
    this.displayString = value;
    this.searchStringProp = `${this.key}:${this.displayString}`;
  }

  public get searchString() {
    return this.searchStringProp;
  }
}

export enum SearchKey {
  KEYWORD = 'keyword',
  AUTHOR = 'author',
  NAME = 'name',
  DESCRIPTION = 'description',
}
