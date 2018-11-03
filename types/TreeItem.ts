export default interface TreeItem {
  readonly id: string;
  readonly name: string;
  readonly path: string;
  readonly children?: TreeItem[];
}
