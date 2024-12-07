import { components as reactSelectComponents, type Props } from 'react-select';
export declare const CheckMark: ({ isDisabled, isFocused, isSelected, }: {
    isDisabled?: boolean;
    isFocused?: boolean;
    isSelected?: boolean;
}) => JSX.Element;
export declare const OptionPrimitive: (typeof reactSelectComponents)['Option'];
type OptionsProps = Props<{
    label: string;
    value: string;
    isDisabled?: boolean;
}, boolean>;
export declare const Options: ({ components: propComponents, ...props }: OptionsProps) => JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map