import { type KeystoneContext } from "../../types/index.js";
import { type PrismaFilter, type UniquePrismaFilter } from "../../types/prisma.js";
import { type InitialisedList } from "./initialise-lists.js";
export type InputFilter = Record<string, any> & {
    _____?: 'input filter';
    AND?: InputFilter[];
    OR?: InputFilter[];
    NOT?: InputFilter[];
};
export type UniqueInputFilter = Record<string, any> & {
    _____?: 'unique input filter';
};
export declare function resolveUniqueWhereInput(inputFilter: UniqueInputFilter, list: InitialisedList, context: KeystoneContext): Promise<UniquePrismaFilter>;
export declare function resolveWhereInput(inputFilter: InputFilter, list: InitialisedList, context: KeystoneContext, isAtRootWhere?: boolean): Promise<PrismaFilter>;
//# sourceMappingURL=where-inputs.d.ts.map