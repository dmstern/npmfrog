const axios = require("axios");
const path = require("path");
const homedir = require("os").homedir();
const config = require(path.join(homedir, ".npmfrog.config.json"));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
axios.defaults.baseURL = `${config.artifactory.baseURL}/artifactory/api/npm/`;
axios.defaults.headers.common["Authorization"] = config.artifactory.apiKey;

const repoKey = config.artifactory.repoKey;

module.exports = {
  fetchPackages: async () => {
    if (process.env.MOCK) {
      return new Promise((resolve, reject) => {
        resolve({
          data: require('./mock/packages-all.json')
        });
      });
    }
    return (request = axios.get(`${repoKey}/-/all`));
  }
};
