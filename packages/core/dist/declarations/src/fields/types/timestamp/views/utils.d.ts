export declare function formatTime(time: string): any;
export declare function parseTime(time: string): any;
export declare function constructTimestamp({ dateValue, timeValue, }: {
    dateValue: string;
    timeValue: string;
}): string;
export declare function deconstructTimestamp(value: string): InnerValue;
export declare function formatOutput(value: string | null): string;
export type InnerValue = {
    dateValue: string | null;
    timeValue: string | {
        kind: 'parsed';
        value: string | null;
    };
};
export type Value = {
    kind: 'create';
    value: InnerValue;
} | {
    kind: 'update';
    value: InnerValue;
    initial: string | null;
};
//# sourceMappingURL=utils.d.ts.map