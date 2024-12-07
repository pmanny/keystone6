'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var React = require('react');
var core = require('@keystone-ui/core');
var PlusIcon = require('@keystone-ui/icons/icons/PlusIcon');
var loading = require('@keystone-ui/loading');
var dataGetter = require('../../../../../dist/dataGetter-cce02896.cjs.dev.js');
require('../../../../../dist/Fields-91ab38a7.cjs.dev.js');
require('../../../../../dist/getRootGraphQLFieldsFromFieldController-1605fcf4.cjs.dev.js');
require('fast-deep-equal');
var PageContainer = require('../../../../../dist/PageContainer-92bd23ef.cjs.dev.js');
var client = require('@apollo/client');
var adminUi_context_dist_keystone6CoreAdminUiContext = require('../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.cjs.dev.js');
var adminUi_router_dist_keystone6CoreAdminUiRouter = require('../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.cjs.dev.js');
require('@keystone-ui/fields');
require('@keystone-ui/button');
require('@emotion/weak-memoize');
require('graphql');
require('@keystone-ui/icons');
require('next/router');
require('@keystone-ui/popover');
require('@keystone-ui/icons/icons/MoreHorizontalIcon');
require('@keystone-ui/icons/icons/ChevronRightIcon');
require('../../../../../dist/SignoutButton-12f572cf.cjs.dev.js');
require('next/link');
require('@keystone-ui/toast');
require('@keystone-ui/modals');
require('apollo-upload-client');
require('@emotion/hash');
require('../../../../../dist/admin-meta-graphql-5b647d4a.cjs.dev.js');
require('next/head');

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
  } = core.useTheme();
  const list = adminUi_context_dist_keystone6CoreAdminUiContext.useList(listKey);
  return core.jsx("div", {
    css: {
      position: 'relative'
    }
  }, core.jsx(adminUi_router_dist_keystone6CoreAdminUiRouter.Link, {
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
  }, core.jsx("h3", {
    css: {
      margin: `0 0 ${spacing.small}px 0`
    }
  }, list.label, " "), list.isSingleton ? null : count.type === 'success' ? core.jsx("span", {
    css: {
      color: colors.foreground,
      textDecoration: 'none'
    }
  }, count.count, " item", count.count !== 1 ? 's' : '') : count.type === 'error' ? count.message : count.type === 'loading' ? core.jsx(loading.LoadingDots, {
    label: `Loading count of ${list.plural}`,
    size: "small",
    tone: "passive"
  }) : 'No access'), hideCreate === false && !list.isSingleton && core.jsx(CreateButton, {
    title: `Create ${list.singular}`,
    href: `/${list.path}/create`
  }, core.jsx(PlusIcon.PlusIcon, {
    size: "large"
  }), core.jsx(core.VisuallyHidden, null, "Create ", list.singular)));
}
function CreateButton(props) {
  const theme = core.useTheme();
  return core.jsx(adminUi_router_dist_keystone6CoreAdminUiRouter.Link, _extends({
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
  } = adminUi_context_dist_keystone6CoreAdminUiContext.useKeystone();
  const query = React.useMemo(() => client.gql`
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
  } = client.useQuery(query, {
    errorPolicy: 'all'
  });
  const dataGetter$1 = dataGetter.makeDataGetter(data, error === null || error === void 0 ? void 0 : error.graphQLErrors);
  return core.jsx(PageContainer.PageContainer, {
    header: core.jsx(core.Heading, {
      type: "h3"
    }, "Dashboard")
  }, visibleLists.state === 'loading' ? core.jsx(core.Center, {
    css: {
      height: `calc(100vh - ${PageContainer.HEADER_HEIGHT}px)`
    }
  }, core.jsx(loading.LoadingDots, {
    label: "Loading lists",
    size: "large",
    tone: "passive"
  })) : core.jsx(core.Inline, {
    as: "ul",
    gap: "large",
    paddingY: "xlarge",
    css: {
      paddingLeft: '0px',
      marginBottom: '0px'
    }
  }, (() => {
    if (visibleLists.state === 'error') {
      return core.jsx("span", {
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
      const result = dataGetter$1.get(key);
      return core.jsx(ListCard, {
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

exports.HomePage = HomePage;
