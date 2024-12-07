import _extends from '@babel/runtime/helpers/esm/extends';
import { useMemo } from 'react';
import { jsx, Heading, Center, Inline, useTheme, VisuallyHidden } from '@keystone-ui/core';
import { PlusIcon } from '@keystone-ui/icons/icons/PlusIcon';
import { LoadingDots } from '@keystone-ui/loading';
import { m as makeDataGetter } from '../../../../../dist/dataGetter-54fa8f6b.esm.js';
import '../../../../../dist/Fields-cb2c206c.esm.js';
import '../../../../../dist/getRootGraphQLFieldsFromFieldController-3d1a0f41.esm.js';
import 'fast-deep-equal';
import { P as PageContainer, H as HEADER_HEIGHT } from '../../../../../dist/PageContainer-85cc832f.esm.js';
import { gql, useQuery } from '@apollo/client';
import { useKeystone, useList } from '../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.esm.js';
import { Link } from '../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.esm.js';
import '@keystone-ui/fields';
import '@keystone-ui/button';
import '@emotion/weak-memoize';
import 'graphql';
import '@keystone-ui/icons';
import 'next/router';
import '@keystone-ui/popover';
import '@keystone-ui/icons/icons/MoreHorizontalIcon';
import '@keystone-ui/icons/icons/ChevronRightIcon';
import '../../../../../dist/SignoutButton-ca58d8c9.esm.js';
import 'next/link';
import '@keystone-ui/toast';
import '@keystone-ui/modals';
import 'apollo-upload-client';
import '@emotion/hash';
import '../../../../../dist/admin-meta-graphql-3524c137.esm.js';
import 'next/head';

function ListCard({
  listKey,
  count,
  hideCreate
}) {
  const {
    colors,
    palette,
    radii,
    spacing
  } = useTheme();
  const list = useList(listKey);
  return jsx("div", {
    css: {
      position: 'relative'
    }
  }, jsx(Link, {
    href: `/${list.path}${list.isSingleton ? '/1' : ''}`,
    css: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: radii.medium,
      borderWidth: 1,
      // boxShadow: shadow.s100,
      display: 'inline-block',
      minWidth: 280,
      padding: spacing.large,
      textDecoration: 'none',
      ':hover': {
        borderColor: palette.blue400
      },
      ':hover h3': {
        textDecoration: 'underline'
      }
    }
  }, jsx("h3", {
    css: {
      margin: `0 0 ${spacing.small}px 0`
    }
  }, list.label, " "), list.isSingleton ? null : count.type === 'success' ? jsx("span", {
    css: {
      color: colors.foreground,
      textDecoration: 'none'
    }
  }, count.count, " item", count.count !== 1 ? 's' : '') : count.type === 'error' ? count.message : count.type === 'loading' ? jsx(LoadingDots, {
    label: `Loading count of ${list.plural}`,
    size: "small",
    tone: "passive"
  }) : 'No access'), hideCreate === false && !list.isSingleton && jsx(CreateButton, {
    title: `Create ${list.singular}`,
    href: `/${list.path}/create`
  }, jsx(PlusIcon, {
    size: "large"
  }), jsx(VisuallyHidden, null, "Create ", list.singular)));
}
function CreateButton(props) {
  const theme = useTheme();
  return jsx(Link, _extends({
    css: {
      alignItems: 'center',
      backgroundColor: theme.palette.neutral400,
      border: 0,
      borderRadius: theme.radii.xsmall,
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      height: 32,
      justifyContent: 'center',
      outline: 0,
      position: 'absolute',
      right: theme.spacing.large,
      top: theme.spacing.large,
      transition: 'background-color 80ms linear',
      width: 32,
      '&:hover, &:focus': {
        color: 'white',
        backgroundColor: theme.tones.positive.fill[0]
      }
    }
  }, props));
}
function HomePage() {
  const {
    adminMeta: {
      lists
    },
    visibleLists
  } = useKeystone();
  const query = useMemo(() => gql`
    query {
      keystone {
        adminMeta {
          lists {
            key
            hideCreate
          }
        }
      }
      ${Object.values(lists).filter(list => !list.isSingleton).map(list => `${list.key}: ${list.gqlNames.listQueryCountName}`).join('\n')}
    }`, [lists]);
  const {
    data,
    error
  } = useQuery(query, {
    errorPolicy: 'all'
  });
  const dataGetter = makeDataGetter(data, error === null || error === void 0 ? void 0 : error.graphQLErrors);
  return jsx(PageContainer, {
    header: jsx(Heading, {
      type: "h3"
    }, "Dashboard")
  }, visibleLists.state === 'loading' ? jsx(Center, {
    css: {
      height: `calc(100vh - ${HEADER_HEIGHT}px)`
    }
  }, jsx(LoadingDots, {
    label: "Loading lists",
    size: "large",
    tone: "passive"
  })) : jsx(Inline, {
    as: "ul",
    gap: "large",
    paddingY: "xlarge",
    css: {
      paddingLeft: '0px',
      marginBottom: '0px'
    }
  }, (() => {
    if (visibleLists.state === 'error') {
      return jsx("span", {
        css: {
          color: 'red'
        }
      }, visibleLists.error instanceof Error ? visibleLists.error.message : visibleLists.error[0].message);
    }
    return Object.keys(lists).map(key => {
      var _data$keystone$adminM, _data$keystone$adminM2;
      if (!visibleLists.lists.has(key)) {
        return null;
      }
      const result = dataGetter.get(key);
      return jsx(ListCard, {
        count: data ? result.errors ? {
          type: 'error',
          message: result.errors[0].message
        } : {
          type: 'success',
          count: data[key]
        } : {
          type: 'loading'
        },
        hideCreate: (_data$keystone$adminM = data === null || data === void 0 || (_data$keystone$adminM2 = data.keystone.adminMeta.lists.find(list => list.key === key)) === null || _data$keystone$adminM2 === void 0 ? void 0 : _data$keystone$adminM2.hideCreate) !== null && _data$keystone$adminM !== void 0 ? _data$keystone$adminM : false,
        key: key,
        listKey: key
      });
    });
  })()));
}

export { HomePage };
