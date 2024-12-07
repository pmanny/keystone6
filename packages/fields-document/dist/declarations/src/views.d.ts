import { type CardValueComponent, type CellComponent, type FieldProps } from '@keystone-6/core/types';
import { type controller, type DocumentFeatures } from "./views-shared.js";
export { controller, } from "./views-shared.js";
export { type DocumentFeatures };
export declare function Field({ field, value, onChange, autoFocus, forceValidation, }: FieldProps<typeof controller>): JSX.Element;
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
export declare const allowedExportsOnCustomViews: string[];
//# sourceMappingURL=views.d.ts.map