module.exports = {
  apps : [
    {
      name: "frog-ui",
      script: "./node_modules/@vue/cli-service/bin/vue-cli-service.js",
      args: "serve",
      watch: true,
      env_local: {
          "MOCK": true,
      }
    },
    {
      name: "frog-server",
      script: "server",
      watch: true,
      env_local: {
          "MOCK": true,
      }
    }
  ]
}
