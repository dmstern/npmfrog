const axios = require("axios");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
axios.defaults.baseURL = 'http://artifactory.init.de/artifactory/api/npm/';
axios.defaults.headers.common['Authorization'] = "AKCp5bB3N7rCWCeSyuh64ehyYQP6HGLAZ9Dc3UhhVKL1hyskWGrjprmxAKfKZoDdf9XfQpVo4";
const repoKey = 'npm';

module.exports = {
  fetchPackages: async () => {
    return await axios.get(`${repoKey}/-/all`);
  }
};
