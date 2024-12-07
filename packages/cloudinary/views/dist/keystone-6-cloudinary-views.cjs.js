'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./keystone-6-cloudinary-views.cjs.prod.js");
} else {
  module.exports = require("./keystone-6-cloudinary-views.cjs.dev.js");
}
