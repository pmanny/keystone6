'use strict';

var core = require('@keystone-ui/core');
var router = require('@keystone-6/core/admin-ui/router');
var react = require('react');

/** @jsxRuntime classic */
const SigninContainer = ({
  children,
  title
}) => {
  const {
    colors,
    shadow
  } = core.useTheme();
  return core.jsx("div", null, core.jsx(router.Head, null, core.jsx("title", null, title || 'Keystone')), core.jsx(core.Center, {
    css: {
      minWidth: '100vw',
      minHeight: '100vh',
      backgroundColor: colors.backgroundMuted
    },
    rounding: "medium"
  }, core.jsx(core.Box, {
    css: {
      background: colors.background,
      width: 600,
      boxShadow: shadow.s100
    },
    margin: "medium",
    padding: "xlarge",
    rounding: "medium"
  }, children)));
};

// TODO: remove or fix
function useRedirect() {
  return react.useMemo(() => '/', []);
}

exports.SigninContainer = SigninContainer;
exports.useRedirect = useRedirect;
