/** @jsxRuntime classic */
/** @jsx jsx */
import { type BoxProps, type ManagedChangeHandler } from '@keystone-ui/core';
import { type SizeKey, type WidthKey } from "./hooks/segmentedControl.js";
type Index = number;
type SegmentedControlProps = {
    /** Whether the selected control indicator should animate its movement. */
    animate?: boolean;
    /** Whether the controls should take up the full width of their container. */
    fill?: boolean;
    /** Function to be called when one of the segments is selected. */
    onChange: ManagedChangeHandler<Index>;
    /** Provide labels for each segment. */
    segments: string[];
    /** To Disable */
    isDisabled?: boolean;
    /** Marks the component as read only */
    isReadOnly?: boolean;
    /** The the selected index of the segmented control. */
    selectedIndex: Index | undefined;
    /** The size of the controls. */
    size?: SizeKey;
    /** The width of the controls. */
    width?: WidthKey;
} & BoxProps;
export declare const SegmentedControl: ({ animate, fill, onChange, segments, isDisabled, isReadOnly, size, width, selectedIndex, ...props }: SegmentedControlProps) => JSX.Element;
export {};
//# sourceMappingURL=SegmentedControl.d.ts.map