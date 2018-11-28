import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import Config from '../types/Config';
import * as showdown from 'showdown';
import { JSDOM } from 'jsdom';

const homedir = os.homedir();
const configFile = 'config.json';
const howToFile = 'howto.md';
const sampleConfigFile = path.join(__dirname, '..', '..', '.sample.config.json');
const configFolder = '.npmfrog';
const sampleConfig = fs.readFileSync(sampleConfigFile);
const configPath = path.join(homedir, configFolder, configFile);
const howToPath = path.join(homedir, configFolder, howToFile);

export default {
  async getConfig(): Promise<Config> {
    try {
      fs.ensureFileSync(configPath);
      const config = fs.readJSONSync(configPath);

      if (fs.existsSync(howToPath)) {
        const additionalHowTo = fs.readFileSync(howToPath).toString();
        const converter = new showdown.Converter();
        const additionalHowToHTML = converter.makeHtml(additionalHowTo);
        const dom = new JSDOM(additionalHowToHTML);
        if (!config.howto) {
          config.howto = {};
        }
        config.howto.additional = {
          markup: additionalHowToHTML,
          heading: dom.window.document.querySelector('h1').textContent,
        };
      }

      return config;
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
        howto: config['howto'],
      };
      // tslint:enable no-string-literal
    }
  },
};
