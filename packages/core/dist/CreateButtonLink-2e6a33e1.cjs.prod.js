'use strict';

var button = require('@keystone-ui/button');
var core = require('@keystone-ui/core');
var adminUi_router_dist_keystone6CoreAdminUiRouter = require('../admin-ui/router/dist/keystone-6-core-admin-ui-router.cjs.prod.js');

/** @jsxRuntime classic */
function CreateButtonLink(props) {
  return core.jsx(button.Button, {
    css: {
      textDecoration: 'none',
      ':hover': {
        color: 'white'
      }
    },
    as: adminUi_router_dist_keystone6CoreAdminUiRouter.Link,
    href: `/${props.list.path}/create`,
    tone: "active",
    size: "small",
    weight: "bold"
  }, "Create ", props.list.singular);
}

exports.CreateButtonLink = CreateButtonLink;
