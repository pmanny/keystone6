import { type ChangeEvent } from 'react';
export type ManagedChangeHandler<V = string, E = ChangeEvent> = (value: V, event: E) => void;
export declare function useManagedState<V, E = ChangeEvent>(controlledValue: V | undefined, defaultValue: V, onChange: ManagedChangeHandler<V, E> | undefined): [V, ManagedChangeHandler<V, E>];
//# sourceMappingURL=useManagedState.d.ts.map