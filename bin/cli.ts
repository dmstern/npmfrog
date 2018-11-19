#!/usr/bin/env node
// =============================================================

import * as path from 'path';
import * as execute from 'cross-spawn';

import * as pm2Config from '../pm2.config';
const port = pm2Config.serveUIStatic.env.PM2_SERVE_PORT;
const logFiles = {
  ui: path.join(__dirname, '..', pm2Config.serveUIStatic.cwd || '', pm2Config.serveUIStatic.log),
  server: path.join(__dirname, '..', pm2Config.runServer.cwd || '', pm2Config.runServer.log),
};

const startCommand = ['run', 'prod'];
const programm = 'npmfrog';
const firstArg = process.argv[2];
const allowedCliCommands = ['stop', 'logs'];
const command: string[] =
  allowedCliCommands.indexOf(firstArg) > -1 ? ['run', firstArg] : startCommand;

const run = execute(`npm`, command);

run.stdout.on('data', data => {
  console.log(data.toString());
});

run.stderr.on('data', data => {
  console.error(data.toString());
});

run.on('exit', code => {
  if (code === 0) {
    if (command === startCommand) {
      console.log(`Running npmFrog in background on http://localhost:${port}`);
      console.log(`To stop npmFrog, run \`${programm} stop\``);
      console.log(
        `Logs can be found in ${logFiles.server} and ${logFiles.ui} .
        Or run \`npmfrog logs\` to get all live logs.`,
      );
    } else if (command[1] === 'stop') {
      console.log(`Stopped npmFrog.`);
    }
  }
});
