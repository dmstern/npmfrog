const axios = require("axios");

const config = require('./config-service.js');
const repoKey = config.artifactory.repoKey;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
axios.defaults.baseURL = `${config.artifactory.baseURL}/artifactory/api/npm/`;
axios.defaults.headers.common["Authorization"] = config.artifactory.apiKey;

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
