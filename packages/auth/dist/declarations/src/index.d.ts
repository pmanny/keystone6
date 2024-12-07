import type { BaseListTypeInfo, KeystoneConfig, BaseKeystoneTypeInfo } from '@keystone-6/core/types';
import type { AuthConfig } from "./types.js";
export type AuthSession = {
    listKey: string;
    itemId: string | number;
    data: unknown;
};
/**
 * createAuth function
 *
 * Generates config for Keystone to implement standard auth features.
 */
export declare function createAuth<ListTypeInfo extends BaseListTypeInfo>({ listKey, secretField, initFirstItem, identityField, magicAuthLink, passwordResetLink, sessionData, }: AuthConfig<ListTypeInfo>): {
    withAuth: <TypeInfo extends BaseKeystoneTypeInfo>(config: KeystoneConfig<TypeInfo>) => KeystoneConfig<TypeInfo>;
};
//# sourceMappingURL=index.d.ts.map