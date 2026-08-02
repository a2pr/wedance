# Deploying the Wedance SPA to a Google Cloud VM

## Overview

Wedance is a static single-page app (Vue 3 + Vite, no backend, no SSR). Shipping it means: build once into a `dist/` folder of minified, hashed HTML/CSS/JS, copy that folder to a Google Cloud VM, and serve it as static files with nginx or Apache. The one non-obvious requirement is the **SPA fallback**: the app uses HTML5 history-mode routing with a catch-all redirect to `/day`, so the web server must rewrite unknown paths to `/index.html` — otherwise a direct hit or refresh on `/day` 404s at the server before Vue Router ever gets a chance to run.

## Prerequisites

- Node.js `^22.18.0` or `>=24.12.0` (per `package.json` `engines`) on whatever machine runs the build — this can be your laptop or a CI runner, it does **not** need to be the VM.
- A GCP VM already provisioned with SSH access (`gcloud compute ssh` or a regular SSH key).
- The VM's firewall allows inbound TCP 80 (add 443 later if you set up HTTPS).

## 1. Build the production bundle

Run this locally or in CI — not on the VM.

Set the real values for both build-time env vars before building. `.env.sample` documents them:

```
VITE_PIX_COPY_PASTE_CODE=12345
VITE_WHATSAPP_PHONE_NUMBER=5592984240045
```

Make sure your local `.env` has the real PIX "copia e cola" code and the real WhatsApp contact number (not placeholders), then build:

```bash
npm ci
npm run build
```

`npm run build` runs a type-check (`vue-tsc`) alongside `vite build`. Vite's production build already minifies JS/CSS/HTML and content-hashes filenames — no extra minification step is needed. Output lands in `dist/`.

## 2. Transfer `dist/` to the VM

```bash
rsync -avz --delete dist/ <user>@<VM_EXTERNAL_IP>:/var/www/wedance/
```

If the VM has no public IP (internal-only, accessed via IAP), use `gcloud compute scp` instead:

```bash
gcloud compute scp --recurse dist/ <vm-name>:/var/www/wedance/ --zone=<zone>
```

Re-run the same command on every future deploy — `--delete` keeps the remote folder in sync with the new build.

## 3. Serve it — Option A: nginx

Install and configure:

```bash
sudo apt update && sudo apt install -y nginx
```

`/etc/nginx/sites-available/wedance`:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/wedance;
    index index.html;

    # SPA fallback — required, see Overview
    location / {
        try_files $uri $uri/ /index.html;
    }

    # long-lived caching for hashed static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/wedance /etc/nginx/sites-enabled/wedance
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## 3. Serve it — Option B: Apache

Install and enable rewrite support:

```bash
sudo apt update && sudo apt install -y apache2
sudo a2enmod rewrite
```

`/etc/apache2/sites-available/wedance.conf`:

```apache
<VirtualHost *:80>
    DocumentRoot /var/www/wedance

    <Directory /var/www/wedance>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

`/var/www/wedance/.htaccess` (SPA fallback — required, see Overview):

```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

Enable and reload:

```bash
sudo a2ensite wedance
sudo a2dissite 000-default
sudo apache2ctl configtest && sudo systemctl reload apache2
```

Pick nginx or Apache — running both on port 80 will conflict.

## 4. Firewall

If the VM's network doesn't already allow HTTP, open it:

```bash
gcloud compute firewall-rules create allow-http \
  --allow=tcp:80 \
  --target-tags=<vm-network-tag> \
  --direction=INGRESS
```

(Add the `http-server` tag to the VM, or match whatever tag/rule scheme your project already uses.)

## 5. Verify

From outside the VM:

```bash
curl -I http://<VM_EXTERNAL_IP>/
curl -I http://<VM_EXTERNAL_IP>/day
```

Both should return `200`. The second call is the important one — it confirms the SPA fallback is working (hitting `/day` directly, not just navigating there client-side from `/`). Then open the site in a browser, select a registration option, and confirm both the PIX code and the "Já paguei!" WhatsApp link use the real values, not the `.env.sample` placeholders.

## Optional follow-ups (not required for first deploy)

- **HTTPS** — once a domain points at the VM's IP, add it with Certbot (`sudo apt install certbot python3-certbot-nginx` or `-apache`, then `sudo certbot --nginx` / `--apache`).
- **Redeploys** — repeat steps 1–2 (build, rsync) for every update; the server config in step 3 doesn't need to change again.
- **Automation** — if manual deploys become frequent, wrap steps 1–2 in a small shell script, or add a GitHub Actions workflow that builds and rsyncs on push to `main`.
