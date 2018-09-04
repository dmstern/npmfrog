import Package from './Package';

export default interface SearchComparable {
  matches(other: SearchComparable, packages: Package[]): boolean;
}
