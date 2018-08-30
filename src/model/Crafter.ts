import { IAuthor } from '@/model/package-json';
import SearchComparable from '@/model/SearchComparable';
import Package from '@/model/Package';

export default class Crafter implements SearchComparable {
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

  public matches(other: SearchComparable, packages: Package[]): boolean {
    if (other instanceof Crafter && other.equals(this)) {
      return true;
    }
    if (other instanceof Package && other.crafters.some((crafter) => crafter.equals(this))) {
      return true;
    }
    for (const item of packages) {
      if (item.matches(this) && item.matches(other)) {
        return true;
      }
    }
    return false;
  }

  public equals(other: Crafter): boolean {
    return this.name === other.name
      && this.email === other.email
      && this.url === other.url;
  }
}
