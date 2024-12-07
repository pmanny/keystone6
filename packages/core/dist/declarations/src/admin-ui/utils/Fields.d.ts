import { type FieldGroupMeta, type FieldMeta } from "../../types/index.js";
import { type Value } from "./index.js";
type FieldsProps = {
    fields: Record<string, FieldMeta>;
    groups?: FieldGroupMeta[];
    value: Value;
    fieldModes?: Record<string, 'hidden' | 'edit' | 'read'> | null;
    fieldPositions?: Record<string, 'form' | 'sidebar'> | null;
    forceValidation: boolean;
    position?: 'form' | 'sidebar';
    invalidFields: ReadonlySet<string>;
    onChange(value: (value: Value) => Value): void;
};
export declare function Fields({ fields, value, fieldModes, fieldPositions, forceValidation, invalidFields, position, groups, onChange, }: FieldsProps): JSX.Element;
export {};
//# sourceMappingURL=Fields.d.ts.map