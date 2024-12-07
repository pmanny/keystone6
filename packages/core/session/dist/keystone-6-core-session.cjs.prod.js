'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var node_crypto = require('node:crypto');
var cookie = require('cookie');
var Iron = require('@hapi/iron');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var cookie__namespace = /*#__PURE__*/_interopNamespace(cookie);
var Iron__default = /*#__PURE__*/_interopDefault(Iron);

// TODO: should we also accept httpOnly?

function statelessSessions({
  secret = node_crypto.randomBytes(32).toString('base64url'),
  maxAge = 60 * 60 * 8,
  // 8 hours,
  cookieName = 'keystonejs-session',
  path = '/',
  secure =         "production" === 'production',
  ironOptions = Iron__default["default"].defaults,
  domain,
  sameSite = 'lax'
} = {}) {
  // atleast 192-bit in base64
  if (secret.length < 32) {
    throw new Error('The session secret must be at least 32 characters long');
  }
  return {
    async get({
      context
    }) {
      var _context$req$headers$;
      if (!(context !== null && context !== void 0 && context.req)) return;
      const cookies = cookie__namespace.parse(context.req.headers.cookie || '');
      const bearer = (_context$req$headers$ = context.req.headers.authorization) === null || _context$req$headers$ === void 0 ? void 0 : _context$req$headers$.replace('Bearer ', '');
      const token = bearer || cookies[cookieName];
      if (!token) return;
      try {
        return await Iron__default["default"].unseal(token, secret, ironOptions);
      } catch (err) {
        // do nothing
      }
    },
    async end({
      context
    }) {
      if (!(context !== null && context !== void 0 && context.res)) return;
      context.res.setHeader('Set-Cookie', cookie__namespace.serialize(cookieName, '', {
        maxAge: 0,
        expires: new Date(),
        httpOnly: true,
        secure,
        path,
        sameSite,
        domain
      }));
    },
    async start({
      context,
      data
    }) {
      if (!(context !== null && context !== void 0 && context.res)) return;
      const sealedData = await Iron__default["default"].seal(data, secret, {
        ...ironOptions,
        ttl: maxAge * 1000
      });
      context.res.setHeader('Set-Cookie', cookie__namespace.serialize(cookieName, sealedData, {
        maxAge,
        expires: new Date(Date.now() + maxAge * 1000),
        httpOnly: true,
        secure,
        path,
        sameSite,
        domain
      }));
      return sealedData;
    }
  };
}
function storedSessions({
  store: storeFn,
  maxAge = 60 * 60 * 8,
  // 8 hours
  ...statelessSessionsOptions
}) {
  const stateless = statelessSessions({
    ...statelessSessionsOptions,
    maxAge
  });
  const store = storeFn({
    maxAge
  });
  return {
    async get({
      context
    }) {
      const sessionId = await stateless.get({
        context
      });
      if (!sessionId) return;
      return store.get(sessionId);
    },
    async start({
      context,
      data
    }) {
      const sessionId = node_crypto.randomBytes(24).toString('base64url'); // 192-bit
      await store.set(sessionId, data);
      return stateless.start({
        context,
        data: sessionId
      }) || '';
    },
    async end({
      context
    }) {
      const sessionId = await stateless.get({
        context
      });
      if (!sessionId) return;
      await store.delete(sessionId);
      await stateless.end({
        context
      });
    }
  };
}

exports.statelessSessions = statelessSessions;
exports.storedSessions = storedSessions;
