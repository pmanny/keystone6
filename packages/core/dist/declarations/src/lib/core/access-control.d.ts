import { type BaseItem, type BaseListTypeInfo, type CreateListItemAccessControl, type DeleteListItemAccessControl, type FieldAccessControl, type FieldCreateItemAccessArgs, type FieldReadItemAccessArgs, type FieldUpdateItemAccessArgs, type IndividualFieldAccessControl, type KeystoneContext, type ListAccessControl, type ListFilterAccessControl, type ListOperationAccessControl, type UpdateListItemAccessControl } from "../../types/index.js";
import { type InitialisedList } from "./initialise-lists.js";
import { type InputFilter } from "./where-inputs.js";
export declare function cannotForItem(operation: string, list: InitialisedList): string;
export declare function cannotForItemFields(operation: string, list: InitialisedList, fieldsDenied: string[]): string;
export declare function getOperationFieldAccess(item: BaseItem, list: InitialisedList, fieldKey: string, context: KeystoneContext, operation: 'read'): Promise<boolean>;
export declare function getOperationAccess(list: InitialisedList, context: KeystoneContext, operation: 'query' | 'create' | 'update' | 'delete'): Promise<boolean>;
export declare function getAccessFilters(list: InitialisedList, context: KeystoneContext, operation: keyof typeof list.access.filter): Promise<boolean | InputFilter>;
export declare function enforceListLevelAccessControl(context: KeystoneContext, operation: 'create' | 'update' | 'delete', list: InitialisedList, inputData: Record<string, unknown>, item: BaseItem | undefined): Promise<void>;
export declare function enforceFieldLevelAccessControl(context: KeystoneContext, operation: 'create' | 'update', list: InitialisedList, inputData: Record<string, unknown>, item: BaseItem | undefined): Promise<void>;
export type ResolvedFieldAccessControl = {
    create: IndividualFieldAccessControl<FieldCreateItemAccessArgs<BaseListTypeInfo>>;
    read: IndividualFieldAccessControl<FieldReadItemAccessArgs<BaseListTypeInfo>>;
    update: IndividualFieldAccessControl<FieldUpdateItemAccessArgs<BaseListTypeInfo>>;
};
export declare function parseFieldAccessControl(access: FieldAccessControl<BaseListTypeInfo> | undefined): ResolvedFieldAccessControl;
export type ResolvedListAccessControl = {
    operation: {
        query: ListOperationAccessControl<'query', BaseListTypeInfo>;
        create: ListOperationAccessControl<'create', BaseListTypeInfo>;
        update: ListOperationAccessControl<'update', BaseListTypeInfo>;
        delete: ListOperationAccessControl<'delete', BaseListTypeInfo>;
    };
    filter: {
        query: ListFilterAccessControl<'query', BaseListTypeInfo>;
        update: ListFilterAccessControl<'update', BaseListTypeInfo>;
        delete: ListFilterAccessControl<'delete', BaseListTypeInfo>;
    };
    item: {
        create: CreateListItemAccessControl<BaseListTypeInfo>;
        update: UpdateListItemAccessControl<BaseListTypeInfo>;
        delete: DeleteListItemAccessControl<BaseListTypeInfo>;
    };
};
export declare function parseListAccessControl(access: ListAccessControl<BaseListTypeInfo>): ResolvedListAccessControl;
//# sourceMappingURL=access-control.d.ts.map