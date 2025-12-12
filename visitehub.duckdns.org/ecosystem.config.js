module.exports = {
  apps: [
    {
      name: "visitehub",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      cwd: "/var/www/mansour/data/www/visitehub.duckdns.org",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

