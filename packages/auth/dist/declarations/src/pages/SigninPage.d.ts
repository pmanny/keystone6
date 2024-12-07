/** @jsxRuntime classic */
/** @jsx jsx */
type SigninPageProps = {
    identityField: string;
    secretField: string;
    mutationName: string;
    successTypename: string;
    failureTypename: string;
};
export declare const getSigninPage: (props: SigninPageProps) => () => JSX.Element;
export declare function SigninPage({ identityField, secretField, mutationName, successTypename, failureTypename, }: SigninPageProps): JSX.Element;
export {};
//# sourceMappingURL=SigninPage.d.ts.map