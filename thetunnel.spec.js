/* eslint-disable no-console */

const crypto = require('crypto');
const http = require('http');
const https = require('https');
const url = require('url');
const assert = require('assert');

const thetunnel = require('./thetunnel');

let fakePort;

before(done => {
  const server = http.createServer();
  server.on('request', (req, res) => {
    res.write(req.headers.host);
    res.end();
  });
  server.listen(() => {
    const { port } = server.address();
    fakePort = port;
    done();
  });
});

it('query thetunnel server w/ ident', async done => {
  const tunnel = await thetunnel({ port: fakePort });
  assert.ok(new RegExp('^https://.*thetunnel.ga$').test(tunnel.url));

  const parsed = url.parse(tunnel.url);
  const opt = {
    host: parsed.host,
    port: 443,
    headers: { host: parsed.hostname },
    path: '/',
  };

  const req = https.request(opt, res => {
    res.setEncoding('utf8');
    let body = '';

    res.on('data', chunk => {
      body += chunk;
    });

    res.on('end', () => {
      assert(/.*[.]thetunnel[.]ga/.test(body), body);
      tunnel.close();
      done();
    });
  });

  req.end();
});

it('request specific domain', async () => {
  const subdomain = Math.random()
    .toString(36)
    .substr(2);
  const tunnel = await thetunnel({ port: fakePort, subdomain });
  assert.ok(new RegExp(`^https://${subdomain}.thetunnel.ga$`).test(tunnel.url));
  tunnel.close();
});

describe('--local-host localhost', () => {
  it('override Host header with local-host', async done => {
    const tunnel = await thetunnel({ port: fakePort, local_host: 'localhost' });
    assert.ok(new RegExp('^https://.*thetunnel.ga$').test(tunnel.url));

    const parsed = url.parse(tunnel.url);
    const opt = {
      host: parsed.host,
      port: 443,
      headers: { host: parsed.hostname },
      path: '/',
    };

    const req = https.request(opt, res => {
      res.setEncoding('utf8');
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        assert.strictEqual(body, 'localhost');
        tunnel.close();
        done();
      });
    });

    req.end();
  });
});

describe('--local-host 127.0.0.1', () => {
  it('override Host header with local-host', async done => {
    const tunnel = await thetunnel({ port: fakePort, local_host: '127.0.0.1' });
    assert.ok(new RegExp('^https://.*thetunnel.ga$').test(tunnel.url));

    const parsed = url.parse(tunnel.url);
    const opt = {
      host: parsed.host,
      port: 443,
      headers: {
        host: parsed.hostname,
      },
      path: '/',
    };

    const req = https.request(opt, res => {
      res.setEncoding('utf8');
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        assert.strictEqual(body, '127.0.0.1');
        tunnel.close();
        done();
      });
    });

    req.end();
  });

  it('send chunked request', async done => {
    const tunnel = await thetunnel({ port: fakePort, local_host: '127.0.0.1' });
    assert.ok(new RegExp('^https://.*thetunnel.ga$').test(tunnel.url));

    const parsed = url.parse(tunnel.url);
    const opt = {
      host: parsed.host,
      port: 443,
      headers: {
        host: parsed.hostname,
        'Transfer-Encoding': 'chunked',
      },
      path: '/',
    };

    const req = https.request(opt, res => {
      res.setEncoding('utf8');
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        assert.strictEqual(body, '127.0.0.1');
        tunnel.close();
        done();
      });
    });

    req.end(crypto.randomBytes(1024 * 8).toString('base64'));
  });
});