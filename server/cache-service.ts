import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import artifactoryService from './artifactory-service';

const readdir = promisify(fs.readdir);

export default {
  tmpDir: path.join(os.homedir(), '.npmfrog', 'package-cache'),

  // tslint:disable-next-line:typedef
  async fillCacheFromDisc() {
    const promises = [];
    const scopes = await readdir(this.tmpDir);
    for (const scope of scopes) {
      const packages = await readdir(path.join(this.tmpDir, scope));
      for (const packageName of packages) {
        const versions = await readdir(path.join(this.tmpDir, scope, packageName));
        for (const version of versions) {
          artifactoryService
            .getPackageDetail({ scope, packageName, version })
            .then(() => {
              console.log(`caching ${scope}/${packageName}@${version} from disc`);
            })
            .catch(() => {
              console.warn(
                `${scope}/${packageName}@${version} on disc seems to be outdated. Is will not be cached.`,
              );
            });
        }
      }
    }
  },
};
