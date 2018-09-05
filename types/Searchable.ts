import Package from './Package';

export default interface Searchable {
  matches(other: Searchable, packages: Package[]): boolean;
}
