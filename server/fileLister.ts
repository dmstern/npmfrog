import { promisify } from 'util';
import { resolve } from 'path';
import * as fs from 'fs';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
let id = 0;

function generateId() {
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 30)
  );
}

export default async function getFiles(
  basedir: string,
  sub: string,
  recursive: boolean,
): Promise<any> {
  const dir = resolve(basedir, sub);
  const subdirs = await readdir(dir);
  return await Promise.all(
    subdirs.map(async subdir => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory()
        ? {
            id: generateId(),
            name: subdir,
            children: await getFiles(basedir, `${sub}/${subdir}`, true),
          }
        : {
            id: generateId(),
            name: subdir,
            path: recursive ? sub.substring(sub.indexOf('/') + 1, sub.length) : '',
          };
    }),
  );
}
