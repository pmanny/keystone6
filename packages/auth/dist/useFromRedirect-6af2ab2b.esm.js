import { useTheme, jsx, Center, Box } from '@keystone-ui/core';
import { Head } from '@keystone-6/core/admin-ui/router';
import { useMemo } from 'react';

/** @jsxRuntime classic */
const SigninContainer = ({
  children,
  title
}) => {
  const {
    colors,
    shadow
  } = useTheme();
  return jsx("div", null, jsx(Head, null, jsx("title", null, title || 'Keystone')), jsx(Center, {
    css: {
      minWidth: '100vw',
      minHeight: '100vh',
      backgroundColor: colors.backgroundMuted
    },
    rounding: "medium"
  }, jsx(Box, {
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
  return useMemo(() => '/', []);
}

export { SigninContainer as S, useRedirect as u };
