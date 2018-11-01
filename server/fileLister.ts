import { promisify } from 'util';
import { resolve } from 'path';
import * as fs from 'fs';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
let id = 0;

export default async function getFiles(dir: string): Promise<any> {
  const subdirs = await readdir(dir);
  return await Promise.all(
    subdirs.map(async subdir => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory()
        ? {
            id: id++,
            name: subdir,
            children: await getFiles(res),
          }
        : {
            id: id++,
            name: subdir,
          };
    }),
  );
}
