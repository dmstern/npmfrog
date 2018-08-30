import { IAuthor } from '@/model/package-json';

export default class Crafter {
  public readonly name?: string;
  public readonly email?: string;
  public readonly url?: string;

  constructor(author?: IAuthor | string) {
    if (author) {
      if (typeof author === 'string') {
        const authorParts = author.split('<');
        if (authorParts.length === 2) {
          this.name = authorParts[0].trim();
          this.email = authorParts[1].slice(0, authorParts[1].length - 1).trim();
        } else {
          this.name = author;
        }
      } else {
        this.name = author.name;
      }
    } else {
      this.name = author;
    }
  }

  public get initials(): string | undefined {
    if (this.name) {
      let nameParts = this.name.split(', ');
      if (nameParts.length === 2) {
        return `${nameParts[1].charAt(0)}${nameParts[0].charAt(0)}`;
      }
      nameParts = this.name.split(' ');
      if (nameParts.length === 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
      }
      return this.name.charAt(0);
    }
  }

  public equals(other: Crafter): boolean {
    return this.name === other.name
      && this.email === other.email
      && this.url === other.url;
  }
}
