import React, { type ReactNode } from 'react';
import type { Theme } from "./types.js";
export declare const ThemeContext: React.Context<{
    theme: Theme;
}>;
export declare const ThemeProvider: ({ theme, children }: {
    theme: Theme;
    children: ReactNode;
}) => React.JSX.Element;
export declare const useTheme: () => Theme;
//# sourceMappingURL=theme.d.ts.map