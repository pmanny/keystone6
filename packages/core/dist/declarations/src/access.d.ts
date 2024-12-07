import type { MaybePromise } from "./types/utils.js";
import type { BaseListTypeInfo } from "./types/index.js";
export declare function allowAll(): boolean;
export declare function denyAll(): boolean;
export declare function unfiltered<ListTypeInfo extends BaseListTypeInfo>(): MaybePromise<boolean | ListTypeInfo['inputs']['where']>;
export declare function allOperations<F>(f: F): {
    query: F;
    create: F;
    update: F;
    delete: F;
};
//# sourceMappingURL=access.d.ts.map