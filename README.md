# npmFrog

> A nice npmjs.org-like web interface for JFrog Artifactory

To share frontend code in your company or team between different projects and developers, you can use a private npm registry like [Verdaccio](https://verdaccio.org/) or [JFrog's Artifactory](https://www.jfrog.com/confluence/display/RTF/Npm+Registry) (which is often used for Maven dependency management in the Java Environment).
The latter lacks of a good UI for web devlopers, so npmFrog is here to present you the self-hosted packages of your team in a more familiar and discoverable way.

It's free and open source. :)

![Screenshot](art/screenshot-list.png)

![Screenshot](art/screenshot-search.png)

![Screenshot](art/screenshot-detail.png)

![Screenshot](art/screenshot-crafter.png)

![Screenshot](art/screenshot-scripts.png)

![Screenshot](art/screenshot-files.png)

## Prerequisites

- [Node.js >= 8.x](https://nodejs.org/en/download/)
- JFrog Artifactory is running somewhere in your company's network

## Installation

```bash
npm i -g npmfrog
```

## Usage

### Start

```bash
npmfrog
```

### Stop

```bash
npmfrog stop
```

### Show logs

```bash
npmfrog logs
```

At the first start up, npmFrog will create a configuration file in your home directory under `~/.npmfrog/config.json`. Please fill this file with with your artifactory properties.

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
