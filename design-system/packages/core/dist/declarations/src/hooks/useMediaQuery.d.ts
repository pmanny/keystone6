import { type Theme } from "../types.js";
type BreakPoints = Theme['breakpoints'];
type BreakPoint = keyof BreakPoints;
export declare const useMediaQuery: () => {
    mq: any;
    maxBreak: (key: BreakPoint) => string;
    minBreak: (key: BreakPoint) => string;
};
export {};
//# sourceMappingURL=useMediaQuery.d.ts.map