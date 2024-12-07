'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./create-keystone-app.cjs.prod.js");
} else {
  module.exports = require("./create-keystone-app.cjs.dev.js");
}
