import { randomBytes } from 'node:crypto';
import * as cookie from 'cookie';
import Iron from '@hapi/iron';

// TODO: should we also accept httpOnly?

function statelessSessions({
  secret = randomBytes(32).toString('base64url'),
  maxAge = 60 * 60 * 8,
  // 8 hours,
  cookieName = 'keystonejs-session',
  path = '/',
  secure = process.env.NODE_ENV === 'production',
  ironOptions = Iron.defaults,
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
      const cookies = cookie.parse(context.req.headers.cookie || '');
      const bearer = (_context$req$headers$ = context.req.headers.authorization) === null || _context$req$headers$ === void 0 ? void 0 : _context$req$headers$.replace('Bearer ', '');
      const token = bearer || cookies[cookieName];
      if (!token) return;
      try {
        return await Iron.unseal(token, secret, ironOptions);
      } catch (err) {
        // do nothing
      }
    },
    async end({
      context
    }) {
      if (!(context !== null && context !== void 0 && context.res)) return;
      context.res.setHeader('Set-Cookie', cookie.serialize(cookieName, '', {
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
      const sealedData = await Iron.seal(data, secret, {
        ...ironOptions,
        ttl: maxAge * 1000
      });
      context.res.setHeader('Set-Cookie', cookie.serialize(cookieName, sealedData, {
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
      const sessionId = randomBytes(24).toString('base64url'); // 192-bit
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

export { statelessSessions, storedSessions };
