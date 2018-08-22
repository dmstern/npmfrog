const axios = require("axios");
const fs = require("fs-extra");
const tar = require("tar");
const showdown = require("showdown");

const config = require("./config-service.js");
const repoKey = config.artifactory.repoKey;
const tmpDir = `${__dirname}/../tmp`;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const s = config.artifactory.https ? "s" : "";
axios.defaults.baseURL = `http${s}://${
  config.artifactory.host
}/artifactory/api/npm/${repoKey}`;
axios.defaults.headers.common["Authorization"] = config.artifactory.apiKey;

function name2url({ scope, packageName }) {
  return `${scope ? `${scope}/` : ""}${packageName}`;
}

function readme2Html(readmeFile) {
  let readme;
  try {
    readme = fs.readFileSync(readmeFile);
  } catch (error) {
    return null;
  }
  const converter = new showdown.Converter();
  const html = converter.makeHtml(readme.toString());
  return html;
}

function readMainCode(storageDir) {
  const packageJson = require(`${storageDir}/package.json`);
  try {
    return fs.readFileSync(`${storageDir}/${packageJson.main}`).toString();
  } catch (error) {
    return null;
  }
}

async function fetchPackages() {
  if (process.env.MOCK) {
    return new Promise((resolve, reject) => {
      resolve({
        data: require(`${__dirname}/mock/packages-all.json`)
      });
    });
  }
  return (request = axios.get(`/-/all`));
}

async function getPackageDetail({ scope, packageName }) { // TODO: add caching object to reduce rest calls to artifactory
  const packageDetailResonse = process.env.MOCK
    ? await new Promise((resolve, reject) => {
        resolve({
          data: require(`${__dirname}/mock/fractal-menu-enhancer.json`)
        });
      })
    : await axios.get(`/${name2url({ scope, packageName })}`);

  const additionalCode = process.env.MOCK
    ? await new Promise((resolve, reject) => {
        resolve({
          readme: readme2Html(
            `${__dirname}/mock/fractal-menu-enhancer.readme.md`
          ),
          mainCode: readMainCode(`${__dirname}/..`)
        });
      })
    : await new Promise(async (resolve, reject) => {
        const packageDetail = packageDetailResonse.data;
        const latestVersionResponse = await getDistTags({ scope, packageName });
        const latestVersion = latestVersionResponse.data.latest;
        const downloadUrl = packageDetail.versions[latestVersion].dist.tarball;
        const storageDir = `${tmpDir}/${scope}/${packageName}/${latestVersion}`;
        if (fs.existsSync(storageDir)) {
          resolve(readAdditionalCode(storageDir));
        } else {
          axios
            // Request package:
            .request({
              responseType: "arraybuffer",
              url: downloadUrl,
              method: "get",
              headers: {
                "Content-Type": "application/gzip"
              }
            })
            // Store package in filesystem:
            .then(result => {
              fs.ensureDirSync(storageDir);
              const outputFilename = `${storageDir}/${packageName}-${latestVersion}.tar.gz`;
              fs.writeFileSync(outputFilename, result.data);
              return outputFilename;
            })
            // Extract package:
            .then(file => {
              const cwd = storageDir;
              return tar.x({ file, cwd }).then(() => cwd);
            })
            .then(dir => {
              resolve(readAdditionalCode(dir));
            });
        }
      });

  Object.assign(packageDetailResonse.data, additionalCode);
  return new Promise((resolve, reject) => {
    resolve(packageDetailResonse);
  });
}

function readAdditionalCode(storageDir) {
  return {
    readme: readme2Html(`${storageDir}/package/README.md`),
    mainCode: readMainCode(`${storageDir}/package`)
  };
}

async function getDistTags({ scope, packageName }) {
  return axios.get(`/-/package/${name2url({ scope, packageName })}/dist-tags`);
}

module.exports = {
  fetchPackages,
  getDistTags,
  getPackageDetail,
  baseURL: axios.defaults.baseURL
};
