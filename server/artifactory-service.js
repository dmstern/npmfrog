const axios = require("axios");
const path = require("path");
const homedir = require("os").homedir();
const configFile = process.env.MOCK
  ? ".sample.npmfrogrc.json"
  : ".npmfrogrc.json";
let config;

try {
  config = require(path.join(__dirname, "..", configFile));
} catch(er1) {
  try {
    config = require(path.join(homedir, configFile));
  } catch(er2) {
    console.log('No config file found. Please create a config file as described in the README.md file or set environment variable MOCK=true to test the UI.');
  }
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
axios.defaults.baseURL = `${config.artifactory.baseURL}/artifactory/api/npm/`;
axios.defaults.headers.common["Authorization"] = config.artifactory.apiKey;

const repoKey = config.artifactory.repoKey;

module.exports = {
  fetchPackages: async () => {
    if (process.env.MOCK) {
      return new Promise((resolve, reject) => {
        resolve({
          data: require("./mock/packages-all.json")
        });
      });
    }
    return (request = axios.get(`${repoKey}/-/all`));
  }
};
