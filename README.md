# Basic Auth Middleware (express)
A middleware for express to configure a basic authentication.

Features:
- Basic Auth with Username, Password
- Whitelist for Hosts
- Whitelist for IP-addresses
- Whitelist for IP-ranges
- specified authentication for other hosts

## Installation
npm -i -S @nexum-ag/basic-auth-middleware

## Simple Example
```
const express = require('express');
const basicAuthMiddleware = require('@nexum-ag/basic-auth-middleware');
const app = express();

app.use(basicAuthMiddleware.default('test','test', {hostsWhitelist: ['localhost:3000']}));
app.get('/', (req, res) => {
  res.send('Huhu all (/)');
});

app.listen(3000, () => console.log('Listening to 3000'));
```

## Configuration
|Option|Type|Description|Example|
|------|----|-----------|-------|
|ipAddressWhitelist|string[]|disable basic auth for this ips|['127.0.0.1', '192.168.0.2']
|ipRangeWhitelist|string[]|disable basic auth for all ip addresses in the range|['10.10.0.0/16', '192.168.1.1/24']
|hostsWhitelist|string[]|disable basic auth for this hosts|['localhost:3000', '127.0.0.1']
|specificHostAuth|{[key: string]: {username: string, password: string}}|change username and password for the specific hosts|{'google.de': { username: 'test', password: 'test' } }
