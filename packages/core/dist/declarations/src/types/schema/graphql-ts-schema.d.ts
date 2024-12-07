import * as graphqlTsSchema from '@graphql-ts/schema';
import type { GraphQLFieldExtensions, GraphQLResolveInfo } from 'graphql';
import { type KeystoneContext } from "../context.js";
export { Boolean, Float, ID, Int, String, enum, enumValues, arg, inputObject, list, nonNull, scalar, } from '@graphql-ts/schema/api-without-context';
export type { Arg, EnumType, EnumValue, InferValueFromArg, InferValueFromArgs, InferValueFromInputType, InputObjectType, InferValueFromOutputType, InputType, ListType, NonNullType, NullableInputType, ScalarType, } from '@graphql-ts/schema/api-without-context';
export { bindGraphQLSchemaAPIToContext } from '@graphql-ts/schema';
export type { BaseSchemaMeta, Extension } from '@graphql-ts/extend';
export { extend, wrap } from '@graphql-ts/extend';
import { type InputType, type Arg } from '@graphql-ts/schema';
export { fields, interface, interfaceField, object, union } from "./schema-api-with-context.js";
type SomeTypeThatIsntARecordOfArgs = string;
type FieldFuncResolve<Source, Args extends {
    [Key in keyof Args]: graphqlTsSchema.Arg<graphqlTsSchema.InputType>;
}, Type extends OutputType, Key extends string, Context extends KeystoneContext<any>> = [
    Key
] extends [keyof Source] ? Source[Key] extends graphqlTsSchema.InferValueFromOutputType<Type> | ((args: graphqlTsSchema.InferValueFromArgs<Args>, context: Context, info: GraphQLResolveInfo) => graphqlTsSchema.InferValueFromOutputType<Type>) ? {
    resolve?: graphqlTsSchema.FieldResolver<Source, SomeTypeThatIsntARecordOfArgs extends Args ? Record<string, Arg<InputType>> : Args, Type, Context>;
} : {
    resolve: graphqlTsSchema.FieldResolver<Source, SomeTypeThatIsntARecordOfArgs extends Args ? Record<string, Arg<InputType>> : Args, Type, Context>;
} : {
    resolve: graphqlTsSchema.FieldResolver<Source, SomeTypeThatIsntARecordOfArgs extends Args ? Record<string, Arg<InputType>> : Args, Type, Context>;
};
type FieldFuncArgs<Source, Args extends {
    [Key in keyof Args]: graphqlTsSchema.Arg<graphqlTsSchema.InputType>;
}, Type extends OutputType, Key extends string, Context extends KeystoneContext> = {
    args?: Args;
    type: Type;
    deprecationReason?: string;
    description?: string;
    extensions?: Readonly<GraphQLFieldExtensions<Source, unknown>>;
} & FieldFuncResolve<Source, Args, Type, Key, Context>;
type FieldFunc = <Source, Type extends OutputType, Key extends string, Context extends KeystoneContext<any>, Args extends {
    [Key in keyof Args]: graphqlTsSchema.Arg<graphqlTsSchema.InputType>;
} = object>(field: FieldFuncArgs<Source, Args, Type, Key, Context>) => graphqlTsSchema.Field<Source, Args, Type, Key, Context>;
export declare const field: FieldFunc;
export declare const JSON: any;
export declare const Upload: any;
export declare const Decimal: any;
export declare const BigInt: any;
export declare const DateTime: any;
export declare const CalendarDay: any;
export declare const Empty: any;
export type NullableType<Context extends KeystoneContext = KeystoneContext> = graphqlTsSchema.NullableType<Context>;
export type Type<Context extends KeystoneContext = KeystoneContext> = graphqlTsSchema.Type<Context>;
export type NullableOutputType<Context extends KeystoneContext = KeystoneContext> = graphqlTsSchema.NullableOutputType<Context>;
export type OutputType<Context extends KeystoneContext = KeystoneContext> = graphqlTsSchema.OutputType<Context>;
export type Field<Source, Args extends Record<string, graphqlTsSchema.Arg<any>>, TType extends OutputType<Context>, Key extends string, Context extends KeystoneContext = KeystoneContext> = graphqlTsSchema.Field<Source, Args, TType, Key, Context>;
export type FieldResolver<Source, Args extends Record<string, graphqlTsSchema.Arg<any>>, TType extends OutputType<Context>, Context extends KeystoneContext = KeystoneContext> = graphqlTsSchema.FieldResolver<Source, Args, TType, Context>;
export type ObjectType<Source, Context extends KeystoneContext = KeystoneContext> = graphqlTsSchema.ObjectType<Source, Context>;
export type UnionType<Source, Context extends KeystoneContext = KeystoneContext> = graphqlTsSchema.UnionType<Source, Context>;
export type InterfaceType<Source, Fields extends Record<string, graphqlTsSchema.InterfaceField<any, OutputType<Context>, Context>>, Context extends KeystoneContext = KeystoneContext> = graphqlTsSchema.InterfaceType<Source, Fields, Context>;
export type InterfaceField<Args extends Record<string, graphqlTsSchema.Arg<any>>, TType extends OutputType<Context>, Context extends KeystoneContext = KeystoneContext> = graphqlTsSchema.InterfaceField<Args, TType, Context>;
//# sourceMappingURL=graphql-ts-schema.d.ts.map