#!/usr/bin/env node
// =============================================================

import * as childProcess from 'child_process';
const exec = childProcess.exec;
import * as path from 'path';
// tslint:disable-next-line:no-var-requires
const pm2Config = require('../pm2.config');
const port = pm2Config.serveUIStatic.env.PM2_SERVE_PORT;
const logFiles = {
  ui: path.join(__dirname, '..', pm2Config.serveUIStatic.cwd || '', pm2Config.serveUIStatic.log),
  server: path.join(__dirname, '..', pm2Config.runServer.cwd || '', pm2Config.runServer.log),
};
const startCommand = 'run prod';
const programm = 'npmfrog';
const firstArg = process.argv[2];
const command = firstArg === 'stop' ? 'stop' : startCommand;

exec(`npm ${command}`, { cwd: __dirname }, (error, stdout, stderr) => {
  console.log(`${stdout}`);
  console.error(`${stderr}`);
  if (command === startCommand) {
    console.log(`Running npmFrog in background on http://localhost:${port}`);
    console.log(`To stop npmFrog, run \`${programm} stop\``);
    console.log(`Logs can be found in ${logFiles.server} and ${logFiles.ui} .`);
  } else if (command === 'stop') {
    console.log(`Stopped npmFrog.`);
  }
  if (error !== null) {
    console.error(`npmFrog error: ${error}`);
  }
});
