const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const artifactoryService = require('./artifactory-service');

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.get('/packages', function(req, res) {
  artifactoryService.fetchPackages().then(response => {
    res.send(response.data);
  }).catch(error => {
    console.log(error);
  });
});

app.get('/package/:scope?/:packageName/dist-tags', function(req, res) {
  artifactoryService.getDistTags(req.params).then(response => {
    res.send(response.data);
  }).catch(error => {
    throw error;
  });
});

app.get('/:scope?/:packageName', function(req, res) {
  artifactoryService.getPackageDetail(req.params).then(response => {
    res.send(response.data);
  }).catch(error => {
    throw error;
  });
});

app.listen(30001);
