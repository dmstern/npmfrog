const tasks = require("./pm2.config");

const runServer = tasks.runServer;
runServer.watch = true;

module.exports = {
  apps: [
    // tasks.tslint,
    tasks.compileServer,
    tasks.watchUI,
    runServer,
  ]
};
