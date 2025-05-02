# Fastify Server Chassis

[![npm version](https://img.shields.io/npm/v/@grinwiz/fastify-chassis.svg)](https://www.npmjs.com/package/@grinwiz/fastify-chassis)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> A minimal, modular, and production-ready Fastify server chassis.

---

## ✨ Features

- 🚀 Fastify server with pluggable architecture
- 🔥 Built-in graceful shutdown handling
- 🧩 PluginManager for core & custom plugins
- 🛠️ RouterManager for modular routing
- 🪝 Lifecycle hooks (`onError`, `onClose`)
- ⚙️ Customizable and extensible
- 📦 Lightweight and production-ready

---

## 📦 Installation

```bash
npm install @grinwiz/fastify-chassis
```

---

## 🚀 Quick Start
```javascript
// config/index.js
require('dotenv').config();

const { name: repositoryName } = require('../package.json');

const config = {
  server: {
    nodeEnv: { $env: 'NODE_ENV', default: 'development' },
    port: { $env: 'PORT', default: 3000, type: 'number' }
  },
  db: {
    host: { $env: 'DB_HOST', type: 'string' },
    credentials: {
      user: { $env: 'DB_USER' },
      password: { $env: 'DB_PASSWORD' },
    },
  },
  logger: {
    name: { $env: 'LOG_NAME', default: repositoryName },
    level: { $env: 'LOG_LEVEL', default: 'info' }
  },
  jwt: {
    secret: { $env: 'JWT_SECRET' },
    expiresIn: { $env: 'JWT_EXPIRES_IN' }
  }
};

module.exports = config;
```

```javascript
// index.js
const { Server } = require('@grinwiz/fastify-chassis');
const config = require('./config');

const server = new Server({
  config,
  routes: [
    // your route definitions
  ],
  plugins: [
    // your plugin definitions
  ]
});

server.start();
```

---

## 🛠️ Server Options

| Name     | Type    | Required | Description                        |
|:---------|:--------|:---------|:-----------------------------------|
| config   | Object  | Yes      | Application config (e.g., port, host, jwt, etc.) |
| routes   | Array   | No       | Array of route definitions         |
| plugins  | Array   | No       | Array of plugin definitions        |

notes: Routes will always register root path (`/`)

---

## 📚 Architecture Overview

```plaintext
lib/
├── loader/
│   ├── index.js.js
│   ├── PluginManager.js
│   ├── RouterManager.js
├── server/
│   ├── Server.js
│   ├── hooks/
│   │   ├── onErrorHook.js
│   │   └── onCloseHook.js
│   ├── plugins/
│   │   ├── gracefulShutdown.js
│   └── └── jwtPlugin.js
├── validations/
│   ├── index.js.js
│   ├── resolveEnv.js
│   ├── validatEnv.js
└── index.js
```

---

## 🔌 PluginManager

- `registerCorePlugins()`: Registers built-in essential plugins (CORS, Helmet, Healthcheck, JWT).
- `registerCustomPlugins(plugins)`: Registers custom user-provided plugins.

Example plugin object:

```javascript
{
  plugin: require('some-plugins'),
  options: { config: this.config }
}
```

---

## 🛤️ RouterManager

Handles modular route registration.

Example route `/src/routes/userRoutes.js`

```javascript
const UserController = require('../controllers/userController');

async function userRoutes(fastify, options) {
  const controller = new UserController(fastify, fastify);

  fastify.get('/me', {}, controller.me);

  fastify.get('/', {}, controller.index);
}

module.exports = {
  route: userRoutes,
  options: { prefix: '/users' }
};
```
Routes index `/src/routes/index.js`
```javascript
const userRoutes = require('./users');
const postRoutes = require('./posts');

module.exports = [
  {
    routes: [userRoutes, postRoutes],
  }
];
```
or we can add `prefix` options like this:
```javascript
const userRoutes = require('./users');
const postRoutes = require('./posts');

module.exports = [
  {
    routes: [userRoutes, postRoutes],
    options: { prefix: '/api/v1' }
  }
];
```

Add it to the server:
```javascript
const server = new Server({
  config,
  routes
});
```

---

## 🛑 Graceful Shutdown

Automatic handling of:
- `SIGINT`
- `SIGTERM`

Ensures:
- Server is closed properly
- Resources are cleaned up
- Hooks are triggered (`onClose`)

---


## ⚡ Performance

- Enabled `ignoreTrailingSlash` for consistent route matching
- Uses Fastify's highly performant logging (customizable)

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you find any bugs or have suggestions for improvements.

---

## 📜 License

Licensed under the [MIT License](LICENSE).
~

