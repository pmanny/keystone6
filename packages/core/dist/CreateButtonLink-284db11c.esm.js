import { Button } from '@keystone-ui/button';
import { jsx } from '@keystone-ui/core';
import { Link } from '../admin-ui/router/dist/keystone-6-core-admin-ui-router.esm.js';

/** @jsxRuntime classic */
function CreateButtonLink(props) {
  return jsx(Button, {
    css: {
      textDecoration: 'none',
      ':hover': {
        color: 'white'
      }
    },
    as: Link,
    href: `/${props.list.path}/create`,
    tone: "active",
    size: "small",
    weight: "bold"
  }, "Create ", props.list.singular);
}

export { CreateButtonLink as C };
