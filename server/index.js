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
  });
});

app.listen(30001);
