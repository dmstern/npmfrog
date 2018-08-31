import { IAuthor } from '@/model/package-json';
import SearchComparable from '@/model/SearchComparable';
import Package from '@/model/Package';
import vuetifyColors from 'vuetify/es5/util/colors';

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

  private static unusedColorsArray: number[] = [];

  // private static colors: Map<string, number> = new Map<string, number>();
  private static get unusedColors(): number[] {
    if (this.unusedColorsArray.length < 1) {
      this.unusedColorsArray = vuetifyColors;
    }
    return this.unusedColorsArray;
  }

  public readonly name?: string;
  public readonly email?: string;
  public readonly url?: string;

  private backgroundColor?: string;

  public get color() {
    if (this.backgroundColor) {
      return this.backgroundColor;
    }
    return this.backgroundColor = this.generateColor();
  }

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

  private generateColor(): string {
    const initials = this.initials;
    // const key = this.email
    //   ? this.email.replace(/ /g, '')
    //   : this.name
    //     ? this.name.replace(/ /g, '')
    //     : '';
    // if (key && Crafter.colors[key]) {
    //   return Crafter.colors[key];
    // }

    function generateColorKeyNumber(hash: number): number {
      let colorKeyNumber = hash % (Object.keys(vuetifyColors).length - 2);
      if (
        colorKeyNumber >= Object.keys(vuetifyColors).length - 2
        || Crafter.unusedColors.some((color) => color === colorKeyNumber)
      ) {
        colorKeyNumber = generateColorKeyNumber(hash + 100);
      }
      return colorKeyNumber;
    }

    if (initials) {
        (initials.charCodeAt(0) + initials.charCodeAt(0));
      Crafter.colors.forEach((oldKey) => {
        if (oldKey === colorKeyNumber) {

        }
      });
      const colorKey = Object.keys(vuetifyColors)[colorKeyNumber];
      const color = colorKey
        .replace(
          /(?:^|\.?)([A-Z])/g, (x, y) => '-' + y.toLowerCase(),
        ).replace(/^-/, '');
      Crafter.colors.push(colorKeyNumber);
      this.backgroundColor = color;
    } else {
      this.backgroundColor = 'accent';
    }
    return this.backgroundColor;
  }

}
