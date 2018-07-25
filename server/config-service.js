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

module.exports = config;
