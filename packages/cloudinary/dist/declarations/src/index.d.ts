import type { CommonFieldConfig, BaseListTypeInfo, FieldTypeFunc } from '@keystone-6/core/types';
import { graphql } from '@keystone-6/core';
type CloudinaryImageFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
        folder?: string;
    };
    db?: {
        map?: string;
    };
};
declare const CloudinaryImageFormat: any;
type CloudinaryImage_File = {
    id: string | null;
    filename: string | null;
    originalFilename: string | null;
    mimetype: string | null;
    encoding: string | null;
    publicUrl: string | null;
    publicUrlTransformed: (args: {
        transformation: graphql.InferValueFromArg<graphql.Arg<typeof CloudinaryImageFormat>>;
    }) => string | null;
};
export declare const outputType: graphql.ObjectType<CloudinaryImage_File>;
export declare function cloudinaryImage<ListTypeInfo extends BaseListTypeInfo>({ cloudinary: cloudinaryConfig, ...config }: CloudinaryImageFieldConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo>;
export {};
//# sourceMappingURL=index.d.ts.map