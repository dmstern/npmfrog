const axios = require("axios");
const path = require('path');
const homedir = require('os').homedir();
const config = require(path.join(homedir, '.npmfrog.config.json'));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
axios.defaults.baseURL = `${config.artifactory.baseURL}/artifactory/api/npm/`;
axios.defaults.headers.common['Authorization'] = config.artifactory.apiKey;

const repoKey = config.artifactory.repoKey;

module.exports = {
  fetchPackages: async () => {
    const request = axios.get(`${repoKey}/-/all`);
    return request;
    // return new Promise((resolve, reject) => {
    //   resolve({data: {
    //     module1: {
    //       name: "hello",
    //       description: "Beschreibung",
    //       author: "icke eben"
    //     },
    //     module2: {
    //       name: "hello",
    //       description: "Beschreibung",
    //       author: "icke eben"
    //     },
    //     module3: {
    //       name: "hello",
    //       description: "Beschreibung",
    //       author: "icke eben"
    //     }
    //   }});
    // });
  }
};
