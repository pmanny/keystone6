/**
 * This file is exposed by the /router entrypoint, and helps ensure that other
 * packages import the same instance of next's router.
 */
export { Router, useRouter, withRouter } from 'next/router';
export type { NextRouter } from 'next/router';
import { type LinkProps as NextLinkProps } from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
export type LinkProps = NextLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;
export declare const Link: any;
export declare const Head: any;
//# sourceMappingURL=router.d.ts.map