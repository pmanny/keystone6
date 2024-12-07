'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var node_crypto = require('node:crypto');
var types = require('@keystone-6/core/types');
var core = require('@keystone-6/core');
var cloudinary = require('cloudinary');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var cloudinary__default = /*#__PURE__*/_interopDefault(cloudinary);

const CloudinaryImageFormat = core.graphql.inputObject({
  name: 'CloudinaryImageFormat',
  description: 'Mirrors the formatting options [Cloudinary provides](https://cloudinary.com/documentation/image_transformation_reference).\n' + 'All options are strings as they ultimately end up in a URL.',
  fields: {
    prettyName: core.graphql.arg({
      description: ' Rewrites the filename to be this pretty string. Do not include `/` or `.`',
      type: core.graphql.String
    }),
    width: core.graphql.arg({
      type: core.graphql.String
    }),
    height: core.graphql.arg({
      type: core.graphql.String
    }),
    crop: core.graphql.arg({
      type: core.graphql.String
    }),
    aspect_ratio: core.graphql.arg({
      type: core.graphql.String
    }),
    gravity: core.graphql.arg({
      type: core.graphql.String
    }),
    zoom: core.graphql.arg({
      type: core.graphql.String
    }),
    x: core.graphql.arg({
      type: core.graphql.String
    }),
    y: core.graphql.arg({
      type: core.graphql.String
    }),
    format: core.graphql.arg({
      type: core.graphql.String
    }),
    fetch_format: core.graphql.arg({
      type: core.graphql.String
    }),
    quality: core.graphql.arg({
      type: core.graphql.String
    }),
    radius: core.graphql.arg({
      type: core.graphql.String
    }),
    angle: core.graphql.arg({
      type: core.graphql.String
    }),
    effect: core.graphql.arg({
      type: core.graphql.String
    }),
    opacity: core.graphql.arg({
      type: core.graphql.String
    }),
    border: core.graphql.arg({
      type: core.graphql.String
    }),
    background: core.graphql.arg({
      type: core.graphql.String
    }),
    overlay: core.graphql.arg({
      type: core.graphql.String
    }),
    underlay: core.graphql.arg({
      type: core.graphql.String
    }),
    default_image: core.graphql.arg({
      type: core.graphql.String
    }),
    delay: core.graphql.arg({
      type: core.graphql.String
    }),
    color: core.graphql.arg({
      type: core.graphql.String
    }),
    color_space: core.graphql.arg({
      type: core.graphql.String
    }),
    dpr: core.graphql.arg({
      type: core.graphql.String
    }),
    page: core.graphql.arg({
      type: core.graphql.String
    }),
    density: core.graphql.arg({
      type: core.graphql.String
    }),
    flags: core.graphql.arg({
      type: core.graphql.String
    }),
    transformation: core.graphql.arg({
      type: core.graphql.String
    })
  }
});
// TODO: lvalue type required by pnpm :(
const outputType = core.graphql.object()({
  name: 'CloudinaryImage_File',
  fields: {
    id: core.graphql.field({
      type: core.graphql.ID
    }),
    // path: types.field({ type: types.String }),
    filename: core.graphql.field({
      type: core.graphql.String
    }),
    originalFilename: core.graphql.field({
      type: core.graphql.String
    }),
    mimetype: core.graphql.field({
      type: core.graphql.String
    }),
    encoding: core.graphql.field({
      type: core.graphql.String
    }),
    publicUrl: core.graphql.field({
      type: core.graphql.String
    }),
    publicUrlTransformed: core.graphql.field({
      args: {
        transformation: core.graphql.arg({
          type: CloudinaryImageFormat
        })
      },
      type: core.graphql.String,
      resolve(rootVal, args) {
        return rootVal.publicUrlTransformed(args);
      }
    })
  }
});

// TODO: no delete support
function cloudinaryImage({
  cloudinary: cloudinaryConfig,
  ...config
}) {
  return meta => {
    var _config$db;
    if (config.isIndexed === 'unique') {
      throw Error("isIndexed: 'unique' is not a supported option for field type cloudinaryImage");
    }
    const inputArg = core.graphql.arg({
      type: core.graphql.Upload
    });
    async function resolveInput(uploadData) {
      if (uploadData === null) {
        return meta.provider === 'postgresql' || meta.provider === 'mysql' ? 'DbNull' : null;
      }
      if (uploadData === undefined) {
        return undefined;
      }
      const {
        createReadStream,
        filename: originalFilename,
        mimetype,
        encoding
      } = await uploadData;
      const stream = createReadStream();

      // TODO: FIXME: stream can be null
      if (!stream) {
        return undefined;
      }
      const id = node_crypto.randomBytes(20).toString('base64url');
      const _meta = await new Promise((resolve, reject) => {
        const cloudinaryStream = cloudinary__default["default"].v2.uploader.upload_stream({
          public_id: id,
          folder: cloudinaryConfig.folder,
          api_key: cloudinaryConfig.apiKey,
          api_secret: cloudinaryConfig.apiSecret,
          cloud_name: cloudinaryConfig.cloudName
        }, (error, result) => {
          if (error || !result) {
            return reject(error);
          }
          resolve(result);
        });
        stream.pipe(cloudinaryStream);
      });
      return {
        id,
        filename: originalFilename,
        originalFilename,
        mimetype,
        encoding,
        _meta
      };
    }
    return types.jsonFieldTypePolyfilledForSQLite(meta.provider, {
      ...config,
      __ksTelemetryFieldTypeName: '@keystone-6/cloudinary',
      input: {
        create: {
          arg: inputArg,
          resolve: resolveInput
        },
        update: {
          arg: inputArg,
          resolve: resolveInput
        }
      },
      output: core.graphql.field({
        type: outputType,
        resolve({
          value
        }) {
          var _val$_meta$secure_url, _val$_meta;
          if (value === null) {
            return null;
          }
          const val = value;
          return {
            publicUrl: (_val$_meta$secure_url = val === null || val === void 0 || (_val$_meta = val._meta) === null || _val$_meta === void 0 ? void 0 : _val$_meta.secure_url) !== null && _val$_meta$secure_url !== void 0 ? _val$_meta$secure_url : null,
            publicUrlTransformed: ({
              transformation
            }) => {
              if (!val._meta) return null;
              const {
                prettyName,
                ...rest
              } = transformation !== null && transformation !== void 0 ? transformation : {};

              // no formatting options provided, return the publicUrl field
              if (!Object.keys(rest).length) {
                var _val$_meta$secure_url2, _val$_meta2;
                return (_val$_meta$secure_url2 = val === null || val === void 0 || (_val$_meta2 = val._meta) === null || _val$_meta2 === void 0 ? void 0 : _val$_meta2.secure_url) !== null && _val$_meta$secure_url2 !== void 0 ? _val$_meta$secure_url2 : null;
              }
              const {
                public_id,
                format
              } = val._meta;

              // ref https://github.com/cloudinary/cloudinary_npm/blob/439586eac73cee7f2803cf19f885e98f237183b3/src/utils.coffee#L472
              // @ts-expect-error
              return cloudinary__default["default"].url(public_id, {
                type: 'upload',
                format,
                secure: true,
                // the default as of version 2
                url_suffix: prettyName,
                transformation,
                cloud_name: cloudinaryConfig.cloudName,
                // SDK analytics defaults to true in version 2 (ref https://github.com/cloudinary/cloudinary_npm/commit/d2510eb677e553a45bc7e363b35d2c20b4c4b144#diff-9aa82f0ed674e050695a7422b1cd56d43ce47e6953688a16a003bf49c3481622)
                //   we default to false for the least surprise, keeping this upgrade as a patch
                urlAnalytics: false
              });
            },
            ...val
          };
        }
      }),
      views: '@keystone-6/cloudinary/views'
    }, {
      map: (_config$db = config.db) === null || _config$db === void 0 ? void 0 : _config$db.map
    });
  };
}

exports.cloudinaryImage = cloudinaryImage;
exports.outputType = outputType;
