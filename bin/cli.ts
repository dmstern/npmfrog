#!/usr/bin/env node
// =============================================================

import * as execute from 'cross-spawn';
import * as pm2Config from '../pm2.config';

const port = pm2Config.serveUIStatic.env.PM2_SERVE_PORT;

const startCommand = ['run', 'prod'];
const program = 'npmfrog';
const firstArg = process.argv[2];
const allowedCliCommands: any = [
  {
    command: 'stop',
    script: 'stop',
  },
  {
    command: 'logs',
    script: 'logs',
  },
  {
    command: 'status',
    script: 'ps',
  },
];
const foundAllowedCommand = allowedCliCommands.find(element => element.command === firstArg);
const command: string[] = foundAllowedCommand ? ['run', foundAllowedCommand.script] : startCommand;

const run = execute(`npm`, command, { cwd: __dirname, env: process.env });

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
      console.log(`To stop npmFrog, run \`${program} stop\``);
      console.log(
        `Logs can be found in ${pm2Config.runServer.log} and ${pm2Config.serveUIStatic.log} .
        Or run \`npmfrog logs\` to get all live logs.`,
      );
    } else if (command[1] === 'stop') {
      console.log(`Stopped npmFrog.`);
    }
  }
});
