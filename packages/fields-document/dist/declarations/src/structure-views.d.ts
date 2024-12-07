/** @jsxRuntime classic */
/** @jsx jsx */
import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig, type FieldProps } from '@keystone-6/core/types';
import { type ComponentSchemaForGraphQL } from "./DocumentEditor/component-blocks/api.js";
export declare function Field({ field, value, onChange, autoFocus, forceValidation, }: FieldProps<typeof controller>): JSX.Element;
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
export declare const allowedExportsOnCustomViews: string[];
export declare function controller(config: FieldControllerConfig): FieldController<{
    kind: 'create' | 'update';
    value: unknown;
}> & {
    schema: ComponentSchemaForGraphQL;
};
//# sourceMappingURL=structure-views.d.ts.map