#!/usr/bin/env node
// Simple post-deploy smoke tester: polls TARGET_URL/health until healthy or timeout
const http = require('http');
const https = require('https');
const { URL } = require('url');

const target = process.env.TARGET_URL;
if (!target) {
  console.error('TARGET_URL not provided');
  process.exit(2);
}

const maxAttempts = parseInt(process.env.SMOKE_MAX_ATTEMPTS || '30', 10);
const delayMs = parseInt(process.env.SMOKE_DELAY_MS || '5000', 10);
const healthPath = process.env.SMOKE_PATH || '/health';
const urlStr = target.replace(/\/$/, '') + healthPath;

console.log(`Starting smoke test against ${urlStr} (maxAttempts=${maxAttempts}, delayMs=${delayMs})`);

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.get(u, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', (err) => reject(err));
    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('request timeout'));
    });
  });
}

async function check() {
  try {
    const res = await httpGet(urlStr);
    console.log(`HTTP ${res.statusCode}: ${res.body}`);
    if (res.statusCode === 200) {
      try {
        const body = JSON.parse(res.body);
        if (body && body.status === 'ok') {
          console.log('Health check passed');
          // proceed to optional deeper checks
          await runOptionalChecks(target);
          console.log('Smoke test passed');
          process.exit(0);
        }
      } catch (e) {
        console.log('Response not JSON or missing status field, but status 200');
        // proceed to optional checks
        await runOptionalChecks(target);
        console.log('Smoke test passed (non-JSON 200)');
        process.exit(0);
      }
    }
  } catch (err) {
    console.log('Request failed:', (err && err.message) || err);
  }
}

async function postJson(url, payload) {
  const { pathname, origin } = new URL(url);
  const full = origin + pathname;
  return new Promise((resolve, reject) => {
    const u = new URL(full);
    const lib = u.protocol === 'https:' ? require('https') : require('http');
    const data = JSON.stringify(payload);
    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    };
    const req = lib.request(u, opts, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function getJson(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? require('https') : require('http');
    const opts = { headers: {} };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    const req = lib.get(u, opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', (e) => reject(e));
    req.setTimeout(10000, () => { req.abort(); reject(new Error('request timeout')); });
  });
}

async function runOptionalChecks(base) {
  // Optional checks: auth register/login and GET /api/goals
  if (!process.env.DO_AUTH_CHECK) {
    console.log('DO_AUTH_CHECK not set — skipping auth and API checks');
    return;
  }

  const smokeEmail = process.env.SMOKE_TEST_EMAIL;
  const smokePass = process.env.SMOKE_TEST_PASSWORD || 'TestPass123!';
  let token = null;

  try {
    if (smokeEmail) {
      console.log('Attempting login with provided test credentials');
      const loginRes = await postJson(base + '/api/auth/login', { email: smokeEmail, password: smokePass });
      console.log('Login response:', loginRes.statusCode, loginRes.body);
      if (loginRes.statusCode === 200) {
        const body = JSON.parse(loginRes.body);
        token = body.token || (body && body.token) || null;
      }
    }
    if (!token) {
      // Attempt to register a temporary user
      const rand = Math.random().toString(36).slice(2, 8);
      const tmpEmail = smokeEmail || `smoke-${Date.now()}-${rand}@example.com`;
      const tmpName = `smoke-${rand}`;
      console.log('Attempting to register temporary user:', tmpEmail);
      const regRes = await postJson(base + '/api/auth/register', { email: tmpEmail, name: tmpName, password: smokePass });
      console.log('Register response:', regRes.statusCode, regRes.body);
      if (regRes.statusCode === 200 || regRes.statusCode === 201) {
        const body = JSON.parse(regRes.body);
        token = body.token || (body && body.token) || null;
      } else if (regRes.statusCode === 400) {
        // maybe email exists — try login
        const loginRes2 = await postJson(base + '/api/auth/login', { email: tmpEmail, password: smokePass });
        if (loginRes2.statusCode === 200) {
          const body = JSON.parse(loginRes2.body);
          token = body.token || null;
        }
      }
    }

    if (token) {
      console.log('Authenticated token acquired, testing GET /api/goals');
      const goalsRes = await getJson(base + '/api/goals', token);
      console.log('GET /api/goals response:', goalsRes.statusCode, goalsRes.body);
      if (goalsRes.statusCode >= 200 && goalsRes.statusCode < 300) {
        console.log('API goals check passed');
      } else {
        throw new Error('API goals check failed');
      }
    } else {
      console.log('No token acquired; skipping authenticated API checks');
    }
  } catch (err) {
    console.error('Optional checks failed:', err && err.message ? err.message : err);
    throw err;
  }
}

(async () => {
  for (let i = 0; i < maxAttempts; i++) {
    await check();
    console.log(`Attempt ${i + 1}/${maxAttempts} failed — sleeping ${delayMs}ms`);
    await new Promise((r) => setTimeout(r, delayMs));
  }
  console.error('Smoke test failed: endpoint did not become healthy in time');
  process.exit(1);
})();
