import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as fs from 'fs-extra';
import artifactoryService from './artifactory-service';
import config from './config-service';

const portNumber = 30001;

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

function handleError(error, targetResponse, msg) {
  targetResponse.status(500).send(`Error: ${msg} Please verify your server settings.\n\n${error}`);
}

app.get('/packages', (req, res) => {
  artifactoryService.fetchPackages().then((response) => {
    res.send(response.data);
  }).catch((error) => {
    handleError(error, res, `Could not get packagages from ${artifactoryService.baseURL}.`);
  });
});

app.get('/package/:scope?/:packageName/dist-tags', (req, res) => {
  artifactoryService.getDistTags(req.params).then((response) => {
    res.send(response.data);
  }).catch((error) => {
    handleError(
      error,
      res,
      `Could not get dist-tags for package "${
        req.params.scope}/${req.params.packageName
      }
      " from ${
        artifactoryService.baseURL
      }.`);
  });
});

app.get('/packageDetail/:scope?/:packageName', (req, res) => {
  artifactoryService.getPackageDetail(req.params).then((response) => {
    res.send(response.data);
  }).catch((error) => {
    handleError(
      error,
      res,
      `Could not get package details for package "${
        req.params.scope
      }/${
        req.params.packageName
      }" from ${
        artifactoryService.baseURL
      }.`);
  });
});

app.get('/config', (req, res) => {
  try {
    res.send({
      artifactory: {
        host: config.artifactory.host,
        repoKey: config.artifactory.repoKey,
        https: config.artifactory.https,
      },
    });
  } catch (error) {
    handleError(error, res, `Could not get npmFrog config from server.`);
  }
});

app.get('/meta', (req, res) => {
  try {
    const packageJson = fs.readJSONSync('../../package.json');
    res.send(packageJson);
  } catch (error) {
    handleError(error, res, `Could not get npmFrog package.json.`);
  }
});

app.listen(portNumber);
