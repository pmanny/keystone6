export type Flags = {
    dbPush: boolean;
    fix: boolean;
    frozen: boolean;
    prisma: boolean;
    server: boolean;
    ui: boolean;
    withMigrations: boolean;
};
export declare function cli(cwd: string, argv: string[]): Promise<void | (() => Promise<void>)>;
//# sourceMappingURL=cli.d.ts.map