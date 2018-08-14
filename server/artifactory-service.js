const axios = require("axios");

const config = require('./config-service.js');
const repoKey = config.artifactory.repoKey;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
axios.defaults.baseURL = `${config.artifactory.baseURL}/artifactory/api/npm/${repoKey}`;
axios.defaults.headers.common["Authorization"] = config.artifactory.apiKey;

function name2url({scope, packageName}) {
  return `${scope ? `${scope}/` : ''}${packageName}`;
}

module.exports = {
  fetchPackages: async () => {
    if (process.env.MOCK) {
      return new Promise((resolve, reject) => {
        resolve({
          data: require("./mock/packages-all.json")
        });
      });
    }
    return (request = axios.get(`/-/all`));
  },

  getPackageDetail: async ({scope, packageName}) => {
    return axios.get(`/${name2url({scope, packageName})}`);
  },

  getDistTags: async ({scope, packageName}) => {
    return axios.get(`/-/package/${name2url({scope, packageName})}/dist-tags`);
  }
};
