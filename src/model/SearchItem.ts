export class SearchItem {
  public key: SearchKey;
  public displayString: string;

  constructor(key: SearchKey, value: string) {
    this.key = key;
    this.displayString = value;
  }
}

export enum SearchKey {
  KEYWORD = 'keyword',
  AUTHOR = 'author',
}
