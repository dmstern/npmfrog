import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import Config from '../types/Config';

const homedir = os.homedir();

const configFile = process.env.MOCK ? '.sample.npmfrogrc.json' : '.npmfrogrc.json';
let config: Config;

try {
  config = fs.readJSONSync(path.join(__dirname, '..', '..', configFile));
} catch (er1) {
  try {
    config = fs.readJSONSync(path.join(homedir, configFile));
  } catch (er2) {
    console.log(
      `No config file found.
      Please create a config file as described in the README.md file
      or set environment variable MOCK=true to test the UI.`,
    );
  }
}

export default config;
