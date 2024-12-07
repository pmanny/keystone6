import Iron from '@hapi/iron';
import type { SessionStrategy, SessionStoreFunction } from "../types/dist/keystone-6-core-types.cjs.js";
type StatelessSessionsOptions = {
    /**
     * Secret used by https://github.com/hapijs/iron for encapsulating data. Must be at least 32 characters long
     */
    secret?: string;
    /**
     * Iron seal options for customizing the key derivation algorithm used to generate encryption and integrity verification keys as well as the algorithms and salt sizes used.
     * See https://hapi.dev/module/iron/api/?v=6.0.0#options for available options.
     *
     * @default Iron.defaults
     */
    ironOptions?: Iron.SealOptions;
    /**
     * Specifies the number (in seconds) to be the value for the `Max-Age`
     * `Set-Cookie` attribute.
     *
     * @default 60 * 60 * 8 // 8 hours
     */
    maxAge?: number;
    /**
     * The name of the cookie used by `Set-Cookie`.
     *
     * @default keystonejs-session
     */
    cookieName?: string;
    /**
     * Specifies the boolean value for the [`Secure` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.5).
     *
     * *Note* be careful when setting this to `true`, as compliant clients will
     * not send the cookie back to the server in the future if the browser does
     * not have an HTTPS connection.
     *
     * @default process.env.NODE_ENV === 'production'
     */
    secure?: boolean;
    /**
     * Specifies the value for the [`Path` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.4).
     *
     * @default '/'
     */
    path?: string;
    /**
     * Specifies the domain for the [`Domain` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.3)
     *
     * @default current domain
     */
    domain?: string;
    /**
     * Specifies the boolean or string to be the value for the [`SameSite` `Set-Cookie` attribute](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7).
     *
     * @default 'lax'
     */
    sameSite?: true | false | 'lax' | 'strict' | 'none';
};
export declare function statelessSessions<Session>({ secret, maxAge, // 8 hours,
cookieName, path, secure, ironOptions, domain, sameSite, }?: StatelessSessionsOptions): SessionStrategy<Session, any>;
export declare function storedSessions<Session>({ store: storeFn, maxAge, // 8 hours
...statelessSessionsOptions }: {
    store: SessionStoreFunction<Session>;
} & StatelessSessionsOptions): SessionStrategy<Session, any>;
export {};
//# sourceMappingURL=session.d.ts.map