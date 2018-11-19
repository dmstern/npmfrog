import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import Config from '../types/Config';

const homedir = os.homedir();
const configFile = 'config.json';
const sampleConfigFile = path.join(__dirname, '..', '..', '.sample.npmfrogrc.json');
const configFolder = '.npmfrog';
const sampleConfig = fs.readFileSync(sampleConfigFile);
const configPath = path.join(homedir, configFolder, configFile);

export default {
  async getConfig(): Promise<Config> {
    try {
      fs.ensureFileSync(configPath);
      return fs.readJSONSync(configPath);
    } catch (er2) {
      console.log(`No config file found.`);
      await fs.writeFile(configPath, sampleConfig);
      console.log(
        `Creating default configuration in ${configPath} . Please fill it with life and restart the server. :)`,
      );
      const config = sampleConfig.toJSON().data;
      // tslint:disable no-string-literal
      return {
        artifactory: config['artifactory'],
        companyScope: config['companyScope'],
      };
      // tslint:enable no-string-literal
    }
  },
};
