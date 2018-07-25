import Package from '@/model/Package';

export default interface SearchComparable {
  matches(other: SearchComparable, packages: Package[]): boolean;
}
