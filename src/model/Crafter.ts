import { IAuthor } from '@/model/package-json';
import SearchComparable from '@/model/SearchComparable';
import Package from '@/model/Package';
import colors from 'vuetify/es5/util/colors';

export default class Crafter implements SearchComparable {

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

  public get color(): string {
    const initials = this.initials;
    const key = this.email
      ? this.email.replace(/ /g, '')
      : this.name
        ? this.name.replace(/ /g, '')
        : '';
    if (key && Crafter.colors[key]) {
      return Crafter.colors[key];
    }

    if (initials) {
      let colorKeyNumber =
        (initials.charCodeAt(0) + initials.charCodeAt(0)) % (Object.keys(colors).length - 2);
      Crafter.colors.forEach((oldKey) => {
        if (oldKey === colorKeyNumber) {
          colorKeyNumber++;
          if (colorKeyNumber >= Object.keys(colors).length - 2) {
            colorKeyNumber -= 2;
          }
        }
      });
      const colorKey = Object.keys(colors)[colorKeyNumber];
      const color = colorKey
        .replace(
          /(?:^|\.?)([A-Z])/g, (x, y) => '-' + y.toLowerCase(),
        ).replace(/^-/, '');
      Crafter.colors.set(key, colorKeyNumber);
      return color;
    }
    return 'accent';
  }

  private static colors: Map<string, number> = new Map<string, number>();

  public readonly name?: string;
  public readonly email?: string;
  public readonly url?: string;

  private backgroundColor?: string;

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
