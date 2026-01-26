module.exports = {
  apps: [
    {
      name: 'cars-na',
      script: '.next/standalone/server.js',
      cwd: '/var/www/cars-na',
      instances: 1,
      exec_mode: 'fork',
      node_args: '--max-old-space-size=768 --gc-interval=100',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        NODE_OPTIONS: '--max-old-space-size=768'
      },
      error_file: '/var/www/cars-na/logs/pm2-error.log',
      out_file: '/var/www/cars-na/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      exp_backoff_restart_delay: 100,
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
