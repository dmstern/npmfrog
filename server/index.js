const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const artifactoryService = require('./artifactory-service');
const portNumber = 30001;

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

function handleError (error, targetResponse, msg) {
  targetResponse.status(500).send(`Error: ${msg} Please verify your server settings.`);
}

app.get('/packages', function(req, res) {
  artifactoryService.fetchPackages().then(response => {
    res.send(response.data);
  }).catch(error => {
    handleError(error, res, `Could not get packagages from ${artifactoryService.baseURL}.`);
  });
});

app.get('/package/:scope?/:packageName/dist-tags', function(req, res) {
  artifactoryService.getDistTags(req.params).then(response => {
    res.send(response.data);
  }).catch(error => {
    handleError(error, res, `Could not get dist-tags for package "${req.params.scope}/${req.params.packageName}" from ${artifactoryService.baseURL}.`);
  });
});

app.get('/packageDetail/:scope?/:packageName', function(req, res) {
  artifactoryService.getPackageDetail(req.params).then(response => {
    res.send(response.data);
  }).catch(error => {
    handleError(error, res, `Could not get package details for package "${req.params.scope}/${req.params.packageName}" from ${artifactoryService.baseURL}.`);
  });
});

app.get('/config', function(req, res) {
  try {
    const config = require("./config-service.js");
    res.send({
      artifactory: {
        host: config.artifactory.host,
        repoKey: config.artifactory.repoKey,
      },
    });
  } catch (error) {
    handleError(error, res, `Could not get npmFrog config from server.`);
  }
});

app.get('/meta', function(req, res) {
  try {
    const packageJson = require("../package.json");
    res.send(packageJson);
  } catch (error) {
    handleError(error, res, `Could not get npmFrog package.json.`);
  }
});

app.listen(portNumber);
