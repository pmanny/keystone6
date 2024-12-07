import { type GraphQLSchemaAPIWithContext } from '@graphql-ts/schema'
import { type Context } from "./graphql-ts-schema.js"

declare const __graphql: GraphQLSchemaAPIWithContext<Context>

export = __graphql
