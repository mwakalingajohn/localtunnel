# The tunnel

Lightweight NGROK alternative
services like twilio which require a public url for callbacks.

## Installation

### Globally

```
npm install -g the-tunnel
```

## CLI usage

When thetunnel is installed globally, just use the `tt` command to start the tunnel.

```
tt --port 8000 --subdomain my-subdomain
```

Thats it! It will connect to the tunnel server, setup the tunnel 'my-subdomain.thetunnel.ga'. This url will remain active for the duration of your session; so feel free to share it with others for happy fun time!

### Arguments

Below are some common arguments. See `tt --help` for additional arguments

- `--subdomain` request a named subdomain on the localtunnel server (default is random characters)
- `--local-host` proxy to a hostname other than localhost

You may also specify arguments via env variables. E.x.

#### options

- `port` (number) [required] The local port number to expose through localtunnel.
- `subdomain` (string) Request a specific subdomain on the proxy server. **Note** You may not actually receive this name depending on availability.
- `host` (string) URL for the upstream proxy server. Defaults to `https://localtunnel.me`.
- `local_host` (string) Proxy to this hostname instead of `localhost`. This will also cause the `Host` header to be re-written to this value in proxied requests.
- `local_https` (boolean) Enable tunneling to local HTTPS server.
- `local_cert` (string) Path to certificate PEM file for local HTTPS server.
- `local_key` (string) Path to certificate key file for local HTTPS server.
- `local_ca` (string) Path to certificate authority file for self-signed certificates.
- `allow_invalid_cert` (boolean) Disable certificate checks for your local HTTPS server (ignore cert/key/ca options).

## License

MIT
