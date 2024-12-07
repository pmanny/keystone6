import type { GraphQLFormattedError } from 'graphql';
import React from 'react';
type GraphQLErrorNoticeProps = {
    networkError: Error | null | undefined;
    errors: readonly GraphQLFormattedError[] | undefined;
};
export declare function GraphQLErrorNotice({ errors, networkError }: GraphQLErrorNoticeProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=GraphQLErrorNotice.d.ts.map