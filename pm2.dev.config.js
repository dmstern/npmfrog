const tasks = require("./pm2.config");

const runServer = tasks.runServer;
runServer.watch = true;

module.exports = {
  apps: [tasks.compileServer, tasks.watchUI, runServer]
};
