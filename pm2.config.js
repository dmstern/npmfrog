const env_local = {
  MOCK: true
};

const log_date_format = "DD-MM-YYYY HH:mm:ss";

module.exports = {
  watchUI: {
    name: "frog-ui",
    script: "./node_modules/@vue/cli-service/bin/vue-cli-service.js",
    args: "serve",
    env_local
  },
  // tslint: {
  //   name: 'frog-tslint',
  //   script: './node_modules/tslint/bin/tslint',
  //   args: "server/**/*.ts",
  //   restart_delay: 10000,
  //   env_local
  // },
  compileServer: {
    name: "frog-compile-server",
    script: "./node_modules/typescript/bin/tsc",
    cwd: "server",
    args: "--watch",
    env_local
  },
  runServer: {
    name: "frog-server",
    script: "index.js",
    cwd: "dist/server/",
    log: '../../frog-server.log',
    env_local
  },
  serveUIStatic: {
    name: "frog-ui-static",
    script: "serve",
    log: './frog-ui.log',
    log_date_format,
    env: {
      PM2_SERVE_PATH: "dist/webui",
      PM2_SERVE_PORT: 8000
    }
  }
};
