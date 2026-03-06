module.exports = {
  apps: [
    {
      name: 'cars-na',
      script: '.next/standalone/server.js',
      cwd: '/var/www/cars-na',
      instances: 1,
      exec_mode: 'fork',
      // Cap Node.js heap at 512MB — forces GC before the process
      // gets swapped to disk under memory pressure
      node_args: '--max-old-space-size=512 --gc-interval=50',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      error_file: '/var/www/cars-na/logs/pm2-error.log',
      out_file: '/var/www/cars-na/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      // Restart if RSS exceeds 512MB — before it starts swapping
      max_memory_restart: '512M',
      exp_backoff_restart_delay: 100,
      restart_delay: 2000,
      max_restarts: 20,
      min_uptime: '30s'
    }
  ]
};
