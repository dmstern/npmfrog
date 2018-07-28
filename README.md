npmFrog
======

A nice npmjs.org-like web interface for jFrog Artifactory

## Project setup

```bash
npm install
```

Create a file `.npmfrog.config.json`in your home directory with the following properties:

```json
{
  "artifactory": {
    "baseURL": "http://<YOUR_ARTIFACTORY_BASE_URL>",
    "apiKey": "<YOUR_ARTIFACTORY_API_KEY>",
    "repoKey": "npm"
  }
}

```

## Start App (Server and WebUI)

```bash
npm start
```

## Frontend Scripts

### Compiles and hot-reloads for development

```bash
npm run startWebui
```

### Compiles and minifies for production

```bash
npm run buildWebui
```

### Lints and fixes files

```bash
npm run lintWebui
```

## Backend (Server) Scripts

### Starts the node.js server

```bash
npm run startServer
```
