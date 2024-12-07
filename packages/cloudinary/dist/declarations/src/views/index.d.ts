/** @jsxRuntime classic */
/** @jsx jsx */
import { type CardValueComponent, type CellComponent, type FieldController, type FieldControllerConfig } from '@keystone-6/core/types';
export { Field } from "./Field.js";
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
type ImageData = {
    id: string;
    filename: string;
    publicUrlTransformed: string;
};
type CloudinaryImageValue = {
    kind: 'empty';
} | {
    kind: 'from-server';
    data: ImageData;
} | {
    kind: 'upload';
    data: {
        file: File;
        validity: ValidityState;
    };
    previous: CloudinaryImageValue;
} | {
    kind: 'remove';
    previous: Exclude<CloudinaryImageValue, {
        kind: 'remove';
    }>;
};
type CloudinaryImageController = FieldController<CloudinaryImageValue>;
export declare const controller: (config: FieldControllerConfig) => CloudinaryImageController;
//# sourceMappingURL=index.d.ts.map