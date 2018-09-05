const tasks = require('./pm2.config');

module.exports = {
  apps: [
    tasks.runServer,
    tasks.serveUIStatic,
  ]
};
