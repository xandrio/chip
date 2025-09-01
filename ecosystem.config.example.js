 module.exports = {
        apps: [{
          name: 'chip',
          script: 'server.mjs',
          cwd: '/home/ubuntu/web/server',
          env: {
            PM2: "true",
            PORT: 4000,
            NODE_ENV: 'production',
            SMTP_HOST: 'smtp.example.com',
            SMTP_PORT: 587,
            SMTP_USER: 'your_user',
            SMTP_PASS: 'your_password',
            RECAPTCHA_SECRET: 'your_recaptcha_secret',
          }
        }]
  };