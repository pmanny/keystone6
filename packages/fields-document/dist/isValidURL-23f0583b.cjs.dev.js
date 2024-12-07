'use strict';

var sanitizeUrl = require('@braintree/sanitize-url');

function isValidURL(url) {
  return url === sanitizeUrl.sanitizeUrl(url) || url === encodeURI(sanitizeUrl.sanitizeUrl(url));
}

exports.isValidURL = isValidURL;
