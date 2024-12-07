'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var router = require('next/router');
var NextLink = require('next/link');
var NextHead = require('next/head');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var NextLink__default = /*#__PURE__*/_interopDefault(NextLink);
var NextHead__default = /*#__PURE__*/_interopDefault(NextHead);

/**
 * This file is exposed by the /router entrypoint, and helps ensure that other
 * packages import the same instance of next's router.
 */
const Link = NextLink__default["default"];
const Head = NextHead__default["default"];

Object.defineProperty(exports, 'Router', {
	enumerable: true,
	get: function () { return router.Router; }
});
Object.defineProperty(exports, 'useRouter', {
	enumerable: true,
	get: function () { return router.useRouter; }
});
Object.defineProperty(exports, 'withRouter', {
	enumerable: true,
	get: function () { return router.withRouter; }
});
exports.Head = Head;
exports.Link = Link;
