module.exports = {
  apps : [
    {
      name: "frog-ui",
      script: "./node_modules/@vue/cli-service/bin/vue-cli-service.js",
      args: "serve",
      env_local: {
          "MOCK": true,
      }
    },
    {
      name: "compile-server",
      script: "tsc",
      cwd: "server",
      args: "--watch",
      env_local: {
          "MOCK": true,
      }
    },
    {
      name: "frog-server",
      script: "index.js",
      watch: true,
      cwd: "dist/server/",
      env_local: {
          "MOCK": true,
      }
    }
  ]
}
