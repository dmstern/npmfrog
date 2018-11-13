# npmFrog

A nice npmjs.org-like web interface for jFrog Artifactory

![Screenshot](art/screenshot-list.png)

![Screenshot](art/screenshot-search.png)

![Screenshot](art/screenshot-detail.png)

![Screenshot](art/screenshot-crafter.png)

![Screenshot](art/screenshot-scripts.png)

![Screenshot](art/screenshot-files.png)

## Installation

```bash
npm i -g npmfrog
```

Duplicate the file `.SAMPLE.npmfrogrc.json` and rename it to `.npmfrogrc.json` (either leave it in the project directory or put it in your home directory).

## Usage

```bash
npmfrog
```

Browse to npmFrog instance [http://localhost:8000](http://localhost:8000).

### Development

```bash
npm run dev
```

With local environment (no internet connection needed):

```bash
npm start
```

To see the logs, run

```bash
npm run logs
```

Stop all running background processes:

```bash
npm stop
```
