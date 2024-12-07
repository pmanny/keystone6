'use strict';

var _extends = require('@babel/runtime/helpers/extends');
var core = require('@keystone-ui/core');
var React = require('react');
var icons = require('@keystone-ui/icons');
var router = require('next/router');
require('@keystone-ui/button');
require('@keystone-ui/popover');
require('@keystone-ui/icons/icons/MoreHorizontalIcon');
require('@keystone-ui/icons/icons/ChevronRightIcon');
var adminUi_context_dist_keystone6CoreAdminUiContext = require('../admin-ui/context/dist/keystone-6-core-admin-ui-context.cjs.prod.js');
var adminUi_router_dist_keystone6CoreAdminUiRouter = require('../admin-ui/router/dist/keystone-6-core-admin-ui-router.cjs.prod.js');
var SignoutButton = require('./SignoutButton-777de56f.cjs.prod.js');
var NextLink = require('next/link');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var NextLink__default = /*#__PURE__*/_interopDefault(NextLink);

/** @jsxRuntime classic */
const Logo = () => {
  var _adminConfig$componen;
  const {
    spacing
  } = core.useTheme();
  const {
    adminConfig
  } = adminUi_context_dist_keystone6CoreAdminUiContext.useKeystone();
  if ((_adminConfig$componen = adminConfig.components) !== null && _adminConfig$componen !== void 0 && _adminConfig$componen.Logo) {
    return core.jsx(adminConfig.components.Logo, null);
  }
  return core.jsx(core.H3, null, core.jsx(NextLink__default["default"], {
    href: "/",
    css: {
      // TODO: we dont' have colors in our design-system for this.
      backgroundImage: `linear-gradient(to right, #0ea5e9, #6366f1)`,
      backgroundClip: 'text',
      lineHeight: '1.75rem',
      color: 'transparent',
      verticalAlign: 'middle',
      transition: 'color 0.3s ease',
      textDecoration: 'none'
    }
  }, core.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 220 220",
    css: {
      display: 'inline-block',
      width: '2rem',
      height: '2rem',
      margin: `0  ${spacing.medium}px ${spacing.xsmall}px 0`,
      verticalAlign: 'middle'
    }
  }, core.jsx("defs", null, core.jsx("linearGradient", {
    id: "logo-a",
    x1: "0%",
    x2: "50%",
    y1: "0%",
    y2: "71.9%"
  }, core.jsx("stop", {
    offset: "0%",
    stopColor: "#5AE8FA"
  }), core.jsx("stop", {
    offset: "100%",
    stopColor: "#2684FF"
  }))), core.jsx("path", {
    fill: "url(#logo-a)",
    fillRule: "evenodd",
    d: "M290.1 47h117.5c17.8 0 24.3 1.9 30.8 5.3a36.3 36.3 0 0115.1 15.2c3.5 6.5 5.4 13 5.4 30.8v117.4c0 17.9-1.9 24.3-5.4 30.8a36.3 36.3 0 01-15.1 15.2c-6.5 3.4-13 5.3-30.8 5.3H290c-17.8 0-24.3-1.9-30.8-5.3a36.3 36.3 0 01-15.1-15.2c-3.5-6.5-5.3-13-5.3-30.8V98.3c0-17.9 1.8-24.3 5.3-30.8a36.3 36.3 0 0115.1-15.2c6.5-3.4 13-5.3 30.8-5.3zm11.8 56.8V218H327v-36.8l14.4-14.6 34.4 51.4h31.5l-49-69.1 44.7-45.1h-31.3L327 151v-47.3H302z",
    transform: "translate(-238.9 -47)"
  })), "Keystone 6"));
};

const NavItem = ({
  href,
  children,
  isSelected: _isSelected
}) => {
  const {
    colors,
    palette,
    spacing,
    radii,
    typography
  } = core.useTheme();
  const router$1 = router.useRouter();
  const isSelected = _isSelected !== undefined ? _isSelected : router$1.pathname === href;
  return core.jsx("li", null, core.jsx(adminUi_router_dist_keystone6CoreAdminUiRouter.Link, {
    "aria-current": isSelected ? 'location' : false,
    href: href,
    css: {
      background: 'transparent',
      borderBottomRightRadius: radii.xsmall,
      borderTopRightRadius: radii.xsmall,
      color: palette.neutral700,
      display: 'block',
      fontWeight: typography.fontWeight.medium,
      marginBottom: spacing.xsmall,
      marginRight: spacing.xlarge,
      padding: `${spacing.small}px ${spacing.xlarge}px`,
      position: 'relative',
      textDecoration: 'none',
      ':hover': {
        background: colors.backgroundHover,
        color: colors.linkHoverColor
      },
      '&[aria-current=location]': {
        background: palette.neutral200,
        color: palette.neutral900
      }
    }
  }, children));
};
const AuthenticatedItemDialog = ({
  item
}) => {
  adminUi_context_dist_keystone6CoreAdminUiContext.useKeystone();
  const {
    spacing,
    typography
  } = core.useTheme();
  return core.jsx("div", {
    css: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: spacing.xlarge,
      marginBottom: 0
    }
  }, item && item.state === 'authenticated' ? core.jsx("div", {
    css: {
      fontSize: typography.fontSize.small
    }
  }, "Signed in as ", core.jsx("strong", {
    css: {
      display: 'block'
    }
  }, item.label)) :         "production" !== 'production' , item && item.state === 'authenticated' && core.jsx(SignoutButton.SignoutButton, null) );
};
const NavigationContainer = ({
  authenticatedItem,
  children
}) => {
  const {
    spacing
  } = core.useTheme();
  return core.jsx("div", {
    css: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative'
    }
  }, core.jsx(AuthenticatedItemDialog, {
    item: authenticatedItem
  }), core.jsx("nav", {
    role: "navigation",
    "aria-label": "Side Navigation",
    css: {
      marginTop: spacing.xlarge
    }
  }, core.jsx("ul", {
    css: {
      padding: 0,
      margin: 0,
      li: {
        listStyle: 'none'
      }
    }
  }, children)));
};
const ListNavItem = ({
  list
}) => {
  const router$1 = router.useRouter();
  return core.jsx(NavItem, {
    isSelected: router$1.pathname.split('/')[1] === `/${list.path}`.split('/')[1],
    href: `/${list.path}${list.isSingleton ? '/1' : ''}`
  }, list.label);
};
const ListNavItems = ({
  lists = [],
  include = []
}) => {
  const renderedList = include.length > 0 ? lists.filter(i => include.includes(i.key)) : lists;
  return core.jsx(React.Fragment, null, renderedList.map(list => {
    return core.jsx(ListNavItem, {
      key: list.key,
      list: list
    });
  }));
};
function Navigation() {
  var _adminConfig$componen;
  const {
    adminMeta: {
      lists
    },
    adminConfig,
    authenticatedItem,
    visibleLists
  } = adminUi_context_dist_keystone6CoreAdminUiContext.useKeystone();
  if (visibleLists.state === 'loading') return null;
  // This visible lists error is critical and likely to result in a server restart
  // if it happens, we'll show the error and not render the navigation component/s
  if (visibleLists.state === 'error') {
    return core.jsx(core.Text, {
      as: "span",
      paddingLeft: "xlarge",
      css: {
        color: 'red'
      }
    }, visibleLists.error instanceof Error ? visibleLists.error.message : visibleLists.error[0].message);
  }
  const renderableLists = Object.keys(lists).map(key => {
    if (!visibleLists.lists.has(key)) return null;
    return lists[key];
  }).filter(x => Boolean(x));
  if (adminConfig !== null && adminConfig !== void 0 && (_adminConfig$componen = adminConfig.components) !== null && _adminConfig$componen !== void 0 && _adminConfig$componen.Navigation) {
    return core.jsx(adminConfig.components.Navigation, {
      authenticatedItem: authenticatedItem,
      lists: renderableLists
    });
  }
  return core.jsx(NavigationContainer, {
    authenticatedItem: authenticatedItem
  }, core.jsx(NavItem, {
    href: "/"
  }, "Dashboard"), core.jsx(ListNavItems, {
    lists: renderableLists
  }));
}

const HEADER_HEIGHT = 80;
const PageWrapper = props => {
  // const { colors } = useTheme();
  return core.jsx(React.Fragment, null, core.jsx("style", null, `body { overflow: hidden; }`), core.jsx("div", _extends({
    css: {
      // background: colors.background,
      display: 'grid',
      gridTemplateColumns: `minmax(300px, 1fr)`,
      gridTemplateRows: `repeat(2,${HEADER_HEIGHT}px) auto`,
      height: '100vh',
      isolation: 'isolate',
      '@media (min-width: 576px)': {
        gridTemplateColumns: `minmax(300px, 1fr) 4fr`,
        gridTemplateRows: `${HEADER_HEIGHT}px auto`
      }
    }
  }, props)));
};
const Sidebar = ({
  isSidebarOpen,
  ...props
}) => {
  // const { colors } = useTheme();

  return core.jsx("div", {
    css: {
      gridColumn: '1/2',
      gridRow: '2/4',
      display: isSidebarOpen ? 'block' : 'none',
      height: '100vh',
      '@media (min-width: 576px)': {
        gridColumn: '1/2',
        gridRow: '2/3',
        display: 'block',
        height: '100%'
      },
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }
  }, core.jsx("aside", _extends({
    css: {
      // borderRight: `1px solid ${colors.border}`,
      minWidth: 0,
      // resolves collapsing issues in children
      WebkitOverflowScrolling: 'touch'
    }
  }, props)));
};
const Content = props => {
  const {
    colors,
    spacing
  } = core.useTheme();
  return core.jsx("main", _extends({
    css: {
      backgroundColor: colors.background,
      boxSizing: 'border-box',
      minWidth: 0,
      // resolves collapsing issues in children
      paddingLeft: spacing.xlarge,
      paddingRight: spacing.xlarge,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      position: 'relative'
    }
  }, props));
};
const PageContainer = ({
  children,
  header,
  title
}) => {
  const {
    colors,
    spacing
  } = core.useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  return core.jsx(PageWrapper, null, core.jsx("div", {
    css: {
      alignItems: 'center',
      // borderRight: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: spacing.xlarge,
      paddingRight: spacing.xlarge
    }
  }, core.jsx(Logo, null), core.jsx("div", {
    onClick: () => {
      setIsSidebarOpen(!isSidebarOpen);
    },
    css: {
      display: 'block',
      '@media (min-width: 576px)': {
        display: 'none'
      }
    }
  }, isSidebarOpen ? core.jsx(icons.XCircleIcon, null) : core.jsx(icons.MenuIcon, null))), core.jsx("header", {
    css: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      minWidth: 0,
      // fix flex text truncation
      paddingLeft: spacing.xlarge,
      paddingRight: spacing.xlarge,
      visibility: isSidebarOpen ? 'hidden' : 'visible'
    }
  }, core.jsx("title", null, title ? `Keystone - ${title}` : 'Keystone'), core.jsx("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  }), header), core.jsx(Sidebar, {
    isSidebarOpen: isSidebarOpen
  }, core.jsx(Navigation, null)), core.jsx(Content, null, children));
};

exports.HEADER_HEIGHT = HEADER_HEIGHT;
exports.ListNavItem = ListNavItem;
exports.ListNavItems = ListNavItems;
exports.Logo = Logo;
exports.NavItem = NavItem;
exports.Navigation = Navigation;
exports.NavigationContainer = NavigationContainer;
exports.PageContainer = PageContainer;
