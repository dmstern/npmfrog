export class SearchItem {
  public key: SearchKey;
  public value: string;

  constructor(key: SearchKey, value: string) {
    this.key = key;
    this.value = value;
  }
}

export enum SearchKey {
  KEYWORD = 'keyword',
  AUTHOR = 'author',
}
