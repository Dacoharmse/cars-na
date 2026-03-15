#!/usr/bin/env python3
"""
VPS Setup Script for cars.na — runs as root, sets up full production stack.
"""
import paramiko
import time
import sys
import io

# Force UTF-8 output on Windows terminals
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '45.8.226.60'
PORT = 22
APP_USER = 'carsna'
APP_PASS = 'N0T4u2c!'
ROOT_PASSWORDS = ['f76d8075f6', 'N0T4u2c!']
LOCAL_ENV = r'C:\Users\User\Projects\cars-na\.env'

# ---------------------------------------------------------------------------
NGINX_CONFIG = """\
server {
    listen 80;
    listen [::]:80;
    server_name cars.na www.cars.na;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, immutable, max-age=31536000";
        proxy_set_header Host $host;
    }
}
"""

PLACEHOLDER_SERVER = """\
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(503, { 'Content-Type': 'text/html' });
  res.end('<html><body><h1>Deploying...</h1><p>Check back soon.</p></body></html>');
}).listen(3000, '0.0.0.0', () => console.log('Placeholder on :3000'));
"""

ECOSYSTEM_CONFIG = """\
module.exports = {
  apps: [{
    name: 'cars-na',
    script: '.next/standalone/server.js',
    cwd: '/var/www/cars-na',
    instances: 1,
    exec_mode: 'fork',
    node_args: '--max-old-space-size=512 --gc-interval=50',
    env: { NODE_ENV: 'production', PORT: 3000, HOSTNAME: '0.0.0.0' },
    error_file: '/var/www/cars-na/logs/pm2-error.log',
    out_file:   '/var/www/cars-na/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    exp_backoff_restart_delay: 100,
    restart_delay: 2000,
    max_restarts: 20,
    min_uptime: '30s',
  }]
};
"""

FAIL2BAN_JAIL = """\
[sshd]
enabled  = true
maxretry = 5
bantime  = 3600
findtime = 600

[nginx-http-auth]
enabled = true
"""
# ---------------------------------------------------------------------------


def connect_root():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    for pwd in ROOT_PASSWORDS:
        try:
            client.connect(HOST, port=PORT, username='root', password=pwd, timeout=15)
            print(f"  Connected as root (password matched)")
            return client
        except paramiko.AuthenticationException:
            continue
    raise RuntimeError("Could not connect as root — check ROOT_PASSWORDS")


def run(client, cmd, desc=None, timeout=300, check=True):
    if desc:
        print(f"\n>>> {desc}")
    chan = client.get_transport().open_session()
    chan.settimeout(timeout)
    chan.exec_command(cmd)

    out_parts, err_parts = [], []
    while True:
        if chan.recv_ready():
            chunk = chan.recv(4096).decode('utf-8', errors='replace')
            out_parts.append(chunk)
            if desc:
                sys.stdout.write(chunk)
                sys.stdout.flush()
        if chan.recv_stderr_ready():
            err_parts.append(chan.recv_stderr(4096).decode('utf-8', errors='replace'))
        if chan.exit_status_ready() and not chan.recv_ready() and not chan.recv_stderr_ready():
            break
        time.sleep(0.05)

    code = chan.recv_exit_status()
    out  = ''.join(out_parts)
    err  = ''.join(err_parts)

    if desc and not out_parts:
        print("(no output)")

    if code != 0 and check:
        print(f"\n  [ERROR] exit {code}")
        if err:
            print(f"  stderr: {str(err)[:800]}")
    elif code == 0 and desc and not out_parts:
        print("  [OK]")

    return out, err, code


def as_user(client, cmd, desc=None, timeout=300, check=True):
    """Run a shell command as APP_USER via runuser (we are root)."""
    # Wrap in single quotes; escape any single quotes inside cmd
    safe = cmd.replace("'", "'\\''")
    return run(client, f"runuser -l {APP_USER} -c '{safe}'", desc, timeout, check)


def write_remote(client, content, remote_path):
    sftp = client.open_sftp()
    with sftp.open(remote_path, 'w') as fh:
        fh.write(content)
    sftp.close()


def upload_file(client, local_path, remote_path):
    sftp = client.open_sftp()
    sftp.put(local_path, remote_path)
    sftp.close()


# ---------------------------------------------------------------------------
def main():
    print("="*60)
    print("cars.na VPS Setup")
    print("="*60)
    client = connect_root()

    # -----------------------------------------------------------------------
    print("\n[1/12] System update & packages")
    # -----------------------------------------------------------------------
    run(client, 'DEBIAN_FRONTEND=noninteractive apt-get update -qq', "apt update", timeout=120)
    run(client, 'DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq', "apt upgrade", timeout=600)
    run(client, ('DEBIAN_FRONTEND=noninteractive apt-get install -y -qq '
                 'curl git nginx certbot python3-certbot-nginx ufw fail2ban'),
        "Installing nginx / certbot / ufw / fail2ban", timeout=300)

    # -----------------------------------------------------------------------
    print("\n[2/12] Node.js 20")
    # -----------------------------------------------------------------------
    run(client, 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -',
        "Adding NodeSource repo", timeout=120)
    run(client, 'DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nodejs',
        "Installing Node.js 20", timeout=120)
    out, _, _ = run(client, 'node -v && npm -v', check=False)
    print(f"  node/npm: {out.strip()}")

    # -----------------------------------------------------------------------
    print("\n[3/12] PM2")
    # -----------------------------------------------------------------------
    run(client, 'npm install -g pm2 --quiet', "Installing PM2 globally", timeout=120)

    # -----------------------------------------------------------------------
    print("\n[4/12] App user & directories")
    # -----------------------------------------------------------------------
    run(client, f'id {APP_USER} 2>/dev/null || useradd -m -s /bin/bash {APP_USER}',
        "Ensuring carsna user exists", check=False)
    run(client, f'echo "{APP_USER}:{APP_PASS}" | chpasswd', "Setting carsna password")
    run(client, 'mkdir -p /var/www/cars-na/.next/standalone /var/www/cars-na/logs',
        "Creating app directories")
    run(client, f'chown -R {APP_USER}:{APP_USER} /var/www/cars-na',
        "Setting ownership")

    # -----------------------------------------------------------------------
    print("\n[5/12] App config files")
    # -----------------------------------------------------------------------
    write_remote(client, ECOSYSTEM_CONFIG, '/var/www/cars-na/ecosystem.config.js')
    write_remote(client, PLACEHOLDER_SERVER, '/var/www/cars-na/.next/standalone/server.js')
    run(client, f'chown -R {APP_USER}:{APP_USER} /var/www/cars-na', check=False)
    print("  Wrote ecosystem.config.js and placeholder server.js [OK]")

    # -----------------------------------------------------------------------
    print("\n[6/12] Transfer .env")
    # -----------------------------------------------------------------------
    print(f"  Uploading {LOCAL_ENV} ...")
    upload_file(client, LOCAL_ENV, '/var/www/cars-na/.next/standalone/.env')
    run(client, f'chown {APP_USER}:{APP_USER} /var/www/cars-na/.next/standalone/.env'
                f' && chmod 600 /var/www/cars-na/.next/standalone/.env',
        "Setting .env permissions")

    # -----------------------------------------------------------------------
    print("\n[7/12] Git repo clone (for Prisma migrations)")
    # -----------------------------------------------------------------------
    run(client, f'mkdir -p /home/{APP_USER}/htdocs/cars.na'
                f' && chown -R {APP_USER}:{APP_USER} /home/{APP_USER}/htdocs',
        "Creating htdocs dir")
    repo_url = 'https://github.com/Dacoharmse/cars-na.git'
    repo_dir = f'/home/{APP_USER}/htdocs/cars.na/cars-na'
    _, err, code = as_user(client, f'git clone {repo_url} {repo_dir}',
                           "Cloning repo", timeout=180, check=False)
    if code != 0 and 'already exists' in err:
        as_user(client, f'git -C {repo_dir} pull origin master',
                "Pulling latest", timeout=60, check=False)
    as_user(client, f'cd {repo_dir} && npm install --legacy-peer-deps --quiet',
            "npm install (for prisma)", timeout=300)
    upload_file(client, LOCAL_ENV, f'{repo_dir}/.env')
    run(client, f'chmod 600 {repo_dir}/.env', check=False)
    as_user(client, f'cd {repo_dir} && npx prisma generate',
            "prisma generate", timeout=120, check=False)

    # -----------------------------------------------------------------------
    print("\n[8/12] SSH key for GitHub Actions")
    # -----------------------------------------------------------------------
    ssh_dir = f'/home/{APP_USER}/.ssh'
    key_file = f'{ssh_dir}/github_actions'
    run(client, f'mkdir -p {ssh_dir} && chmod 700 {ssh_dir}')
    run(client, f'[ -f {key_file} ] || ssh-keygen -t ed25519 -f {key_file} -N "" -C "github-actions" -q',
        "Generating deploy keypair", check=False)
    run(client, f'cat {key_file}.pub >> {ssh_dir}/authorized_keys', "Adding to authorized_keys")
    run(client, f'sort -u {ssh_dir}/authorized_keys -o {ssh_dir}/authorized_keys', check=False)
    run(client, f'chmod 600 {ssh_dir}/authorized_keys {key_file}'
                f' && chown -R {APP_USER}:{APP_USER} {ssh_dir}')

    private_key_b64, _, _ = run(client, f'base64 -w 0 {key_file}', "Reading private key b64")
    private_key_b64 = private_key_b64.strip()

    # -----------------------------------------------------------------------
    print("\n[9/12] Nginx")
    # -----------------------------------------------------------------------
    run(client, 'mkdir -p /var/www/certbot')
    write_remote(client, NGINX_CONFIG, '/tmp/cars-na-nginx')
    run(client, 'cp /tmp/cars-na-nginx /etc/nginx/sites-available/cars-na', "Installing nginx config")
    run(client, 'ln -sf /etc/nginx/sites-available/cars-na /etc/nginx/sites-enabled/cars-na', "Enabling site")
    run(client, 'rm -f /etc/nginx/sites-enabled/default', "Removing default site")
    run(client, 'nginx -t', "Testing nginx config")
    run(client, 'systemctl enable nginx && systemctl reload nginx', "Enabling nginx")

    # -----------------------------------------------------------------------
    print("\n[10/12] PM2 start")
    # -----------------------------------------------------------------------
    as_user(client, 'pm2 delete cars-na 2>/dev/null; true', check=False)
    as_user(client, 'cd /var/www/cars-na && pm2 start ecosystem.config.js',
            "Starting PM2 with ecosystem")
    as_user(client, 'pm2 save', "Saving PM2 list")
    # Startup script (must run as root for systemd)
    run(client, f'pm2 startup systemd -u {APP_USER} --hp /home/{APP_USER}',
        "Creating PM2 systemd service", check=False)
    run(client, f'systemctl enable pm2-{APP_USER} && systemctl start pm2-{APP_USER}',
        "Enabling PM2 on boot", check=False)

    time.sleep(4)
    out, _, code = run(client, 'curl -sf --max-time 5 http://localhost:3000 -o /dev/null -w "%{http_code}"',
                       "Health check port 3000", check=False)
    print(f"  HTTP status: {out.strip() or '(no response yet)'}")
    if not out.strip() or out.strip() == '000':
        as_user(client, 'pm2 logs cars-na --lines 30 --nostream', "PM2 logs", check=False)

    # -----------------------------------------------------------------------
    print("\n[11/12] SSL — Let's Encrypt")
    # -----------------------------------------------------------------------
    _, err, code = run(client,
        'certbot --nginx -d cars.na -d www.cars.na '
        '--non-interactive --agree-tos --email admin@cars.na --redirect',
        "certbot", timeout=120, check=False)
    if code != 0:
        print("  [WARNING] Certbot failed — DNS may not point here yet.")
        print("  Re-run: certbot --nginx -d cars.na -d www.cars.na")
    else:
        run(client, 'systemctl reload nginx', "Reloading nginx with SSL")

    # -----------------------------------------------------------------------
    print("\n[12/12] UFW firewall & fail2ban")
    # -----------------------------------------------------------------------
    run(client, 'ufw --force reset', check=False)
    run(client, 'ufw default deny incoming && ufw default allow outgoing')
    run(client, 'ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp',
        "Opening SSH/HTTP/HTTPS")
    run(client, 'echo "y" | ufw enable', "Enabling UFW")

    write_remote(client, FAIL2BAN_JAIL, '/etc/fail2ban/jail.local')
    run(client, 'systemctl enable fail2ban && systemctl restart fail2ban', "Enabling fail2ban")

    # -----------------------------------------------------------------------
    print("\n--- Final status ---")
    as_user(client, 'pm2 list', "PM2 processes")
    run(client, 'systemctl is-active nginx fail2ban ufw', check=False)
    run(client, 'ufw status', "UFW rules", check=False)

    client.close()

    print("\n" + "="*60)
    print("SETUP COMPLETE!")
    print("="*60)
    print("\nAdd these 3 secrets at:")
    print("https://github.com/Dacoharmse/cars-na/settings/secrets/actions\n")
    print(f"  VPS_HOST      = {HOST}")
    print(f"  VPS_USERNAME  = {APP_USER}")
    print(f"  VPS_SSH_KEY   = {private_key_b64}")
    print("\nThen push a commit (or trigger workflow_dispatch) for the first deploy.")
    print("="*60)


if __name__ == '__main__':
    main()
