'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./keystone-6-fields-document-structure-views.cjs.prod.js");
} else {
  module.exports = require("./keystone-6-fields-document-structure-views.cjs.dev.js");
}
