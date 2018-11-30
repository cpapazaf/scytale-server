module.exports = {
  apps : [{
    name: 'SocketIOServer',
    script: 'server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 1,
    disable_logs: false,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      DEBUG: false
    },
    env_production: {
      NODE_ENV: 'production',
      DEBUG: false
    },
    env_development: {
      NODE_ENV: 'development',
      DEBUG: true
    }
  }],
};
