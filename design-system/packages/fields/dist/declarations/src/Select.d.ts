import { type Options, type Props } from 'react-select';
import { type WidthType } from "./types.js";
type Option = {
    label: string;
    value: string;
    isDisabled?: boolean;
};
type BaseSelectProps = Omit<Props<Option, boolean>, 'value' | 'onChange' | 'isMulti' | 'isOptionDisabled'> & {
    width?: WidthType;
};
export { components as selectComponents } from 'react-select';
export declare function Select({ id, onChange, value, width: widthKey, portalMenu, styles, ...props }: BaseSelectProps & {
    value: Option | null;
    portalMenu?: true;
    onChange(value: Option | null): void;
}): JSX.Element;
export declare function MultiSelect({ id, onChange, value, width: widthKey, portalMenu, styles, ...props }: BaseSelectProps & {
    value: Options<Option>;
    portalMenu?: true;
    onChange(value: Options<Option>): void;
}): JSX.Element;
//# sourceMappingURL=Select.d.ts.map