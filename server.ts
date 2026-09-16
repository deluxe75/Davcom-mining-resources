import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const PHP_PORT = 8000;

// 1. Ensure MariaDB (MySQL) is running
try {
  const check = execSync('mariadb -e "SELECT 1;" 2>&1 || true').toString();
  if (!check.includes('1')) {
    console.log('[MySQL] Starting MariaDB service...');
    execSync("nohup /usr/bin/mariadbd-safe --datadir='/var/lib/mysql' --nowatch > /dev/null 2>&1 &");
    execSync('sleep 2');
  }
  console.log('[MySQL] MariaDB database is connected and active.');
} catch (err) {
  console.warn('[MySQL] Warning starting MariaDB:', err);
}

// 2. Start PHP Backend Built-in Web Server
const phpProcess = spawn('php', ['-S', `127.0.0.1:${PHP_PORT}`, 'backend/router.php'], {
  cwd: __dirname,
  stdio: 'inherit',
});

phpProcess.on('error', (err) => {
  console.error('[PHP] Failed to start PHP server:', err);
});

process.on('exit', () => {
  try {
    phpProcess.kill();
  } catch (_) {}
});

async function startServer() {
  const app = express();

  // 3. Reverse Proxy API and Uploads to PHP Backend
  const phpProxy = createProxyMiddleware({
    target: `http://127.0.0.1:${PHP_PORT}`,
    changeOrigin: true,
    ws: false,
  });

  app.use('/api', phpProxy);
  app.use('/backend/api', phpProxy);
  app.use('/uploads', phpProxy);
  app.use('/backend/uploads', phpProxy);

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'DAVCOM MINING RESOURCES NIG LTD API',
      php: `http://127.0.0.1:${PHP_PORT}`,
    });
  });

  // 4. Vite Middleware or Static Production Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DAVCOM App] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
