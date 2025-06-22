 module.exports = {
        apps: [{
          name: 'chip',
          script: 'server.mjs',
          cwd: '/home/ubuntu/web/server',
          env: {
                PM2: "true",
                PORT: 4000
          }
        }]
  };