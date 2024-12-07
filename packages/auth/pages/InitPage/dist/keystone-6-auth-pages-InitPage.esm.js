import { useMemo, useState } from 'react';
import fetch from 'cross-fetch';
import { forwardRefWithAs, jsx, H1, Stack, Inline } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { FieldLabel, TextInput, Checkbox } from '@keystone-ui/fields';
import isDeepEqual from 'fast-deep-equal';
import { useMutation, gql } from '@keystone-6/core/admin-ui/apollo';
import { useKeystone, useReinitContext } from '@keystone-6/core/admin-ui/context';
import { useRouter, Link } from '@keystone-6/core/admin-ui/router';
import { GraphQLErrorNotice } from '@keystone-6/core/admin-ui/components';
import { useInvalidFields, Fields, serializeValueToObjByFieldKey } from '@keystone-6/core/admin-ui/utils';
import _extends from '@babel/runtime/helpers/esm/extends';
import { u as useRedirect, S as SigninContainer } from '../../../dist/useFromRedirect-6af2ab2b.esm.js';

const emailKeysToGuess = ['email', 'username'];
const guessEmailFromValue = value => {
  for (const key of emailKeysToGuess) {
    if (value[key] && typeof value[key].value === 'string') {
      return value[key].value;
    }
  }
};

// email validation regex from https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
const validEmail = email => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);

const Icon = ({
  children,
  ...props
}) => {
  return jsx("a", _extends({
    css: {
      color: '#6C798F',
      // arch colors.n60
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 24,
      width: 24,
      // ':not(:first-of-type)': {
      //   marginLeft: '0.25em',
      // },
      // ':not(:last-of-type)': {
      //   marginRight: '0.25em',
      // },

      ':hover,:focus': {
        color: '#253858' // arch colors.N80,
      },
      svg: {
        width: '100%'
      }
    }
  }, props), children);
};
const IconTwitter = props => jsx(Icon, props, jsx("svg", {
  viewBox: "0 0 24 20",
  xmlns: "http://www.w3.org/2000/svg"
}, jsx("path", {
  d: "M7.548 20c9.056 0 14.01-7.695 14.01-14.368 0-.219 0-.437-.015-.653.964-.715 1.796-1.6 2.457-2.614a9.638 9.638 0 0 1-2.828.794A5.047 5.047 0 0 0 23.337.366a9.72 9.72 0 0 1-3.127 1.226C18.684-.072 16.258-.48 14.294.598c-1.964 1.078-2.98 3.374-2.475 5.6C7.859 5.994 4.17 4.076 1.67.922.363 3.229 1.031 6.18 3.195 7.662A4.795 4.795 0 0 1 .96 7.032v.064c0 2.403 1.653 4.474 3.95 4.95a4.797 4.797 0 0 1-2.223.087c.645 2.057 2.494 3.466 4.6 3.506A9.725 9.725 0 0 1 0 17.732a13.688 13.688 0 0 0 7.548 2.264",
  fill: "currentColor",
  fillRule: "nonzero"
})), jsx(A11yText, null, "Hear about KeystoneJS on Twitter"));
const IconGithub = props => jsx(Icon, props, jsx("svg", {
  viewBox: "0 0 16 16",
  version: "1.1",
  "aria-hidden": "true"
}, jsx("path", {
  fill: "currentColor",
  fillRule: "evenodd",
  d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
})), jsx(A11yText, null, "KeystoneJS repository on GitHub"));

// ==============================
// Misc
// ==============================

const A11yText = forwardRefWithAs(({
  as: Tag = 'span',
  ...props
}, ref) => jsx(Tag, _extends({
  ref: ref,
  css: {
    border: 0,
    clip: 'rect(1px, 1px, 1px, 1px)',
    height: 1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1
  }
}, props)));

/** @jsxRuntime classic */
const signupURL = 'https://endpoints.thinkmill.com.au/newsletter';
function Welcome({
  value,
  onContinue
}) {
  const [subscribe, setSubscribe] = useState({
    keystone: false,
    thinkmill: false
  });
  const [email, setEmail] = useState(guessEmailFromValue(value));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const onSubmit = async event => {
    event.preventDefault();
    setError(null);

    // Check if user wants to subscribe and a valid email address
    if (subscribe.keystone || subscribe.thinkmill) {
      setLoading(true);
      if (!validEmail(email)) {
        setError('Email is invalid');
        return;
      }
      const tags = ['source:@keystone-6/auth'];
      if (subscribe.keystone) tags.push('list:keystone');
      if (subscribe.thinkmill) tags.push('list:thinkmill');
      const res = await fetch(signupURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          tags
        })
      });
      try {
        if (res.status !== 200) {
          const {
            error
          } = await res.json();
          setError(error);
          return;
        }
      } catch (e) {
        // network errors or failed parse
        setError(e.message.toString());
        return;
      }
      setLoading(false);
    }
    onContinue();
  };
  return jsx(Stack, {
    gap: "medium"
  }, jsx(Stack, {
    gap: "small",
    align: "center",
    across: true,
    css: {
      width: '100%',
      justifyContent: 'space-between'
    }
  }, jsx(H1, null, "Welcome"), jsx(Stack, {
    across: true,
    gap: "small"
  }, jsx(IconTwitter, {
    href: "https://twitter.com/keystonejs",
    target: "_blank",
    title: "Twitter Logo"
  }), jsx(IconGithub, {
    href: "https://github.com/keystonejs/keystone",
    target: "_blank",
    title: "Github"
  }))), jsx("p", {
    css: {
      margin: 0
    }
  }, "Thanks for installing Keystone, for help getting started see our documentation at", ' ', jsx("a", {
    href: "https://keystonejs.com"
  }, "keystonejs.com")), jsx("p", null, "To stay connected to the latest Keystone and ", jsx("a", {
    href: "https://thinkmill.com.au",
    target: "_blank"
  }, "Thinkmill"), " news, signup to our newsletters:"), jsx("form", {
    onSubmit: onSubmit
  }, jsx(Stack, {
    gap: "medium"
  }, jsx(FieldLabel, {
    htmlFor: "email-field"
  }, "Email"), jsx(TextInput, {
    id: "email-field",
    autoFocus: true,
    required: subscribe.keystone || subscribe.thinkmill,
    placeholder: 'example@gmail.com',
    value: email,
    onChange: e => setEmail(e.target.value)
  }), jsx(Inline, {
    gap: "medium"
  }, jsx(Checkbox, {
    size: "small",
    checked: subscribe.keystone,
    onChange: () => {
      setError(null);
      setSubscribe(prevState => ({
        ...prevState,
        keystone: !subscribe.keystone
      }));
    }
  }, "Keystone news"), jsx(Checkbox, {
    size: "small",
    checked: subscribe.thinkmill,
    onChange: () => {
      setError(null);
      setSubscribe(prevState => ({
        ...prevState,
        thinkmill: !subscribe.thinkmill
      }));
    }
  }, "Thinkmill news (", jsx("a", {
    href: "https://www.thinkmill.com.au/newsletter/tailwind-for-designers-multi-brand-design-systems-and-a-search-tool-for-public-domain-content",
    target: "_blank",
    "aria-label": "Thinkmill (Opens in new tab)"
  }, "example"), ")"))), jsx("p", {
    css: {
      color: 'red'
    }
  }, error), jsx(Inline, {
    gap: "medium",
    align: "center"
  }, jsx(Button, {
    isLoading: loading,
    type: 'submit',
    weight: "bold",
    tone: "active"
  }, error ? 'Try again' : 'Continue'), error && jsx(Button, {
    as: Link,
    href: '/',
    tone: "active"
  }, "Continue"))));
}
function InitPage({
  fieldPaths,
  listKey,
  enableWelcome
}) {
  var _data$authenticate;
  const {
    adminMeta
  } = useKeystone();
  const fields = useMemo(() => {
    const fields = {};
    fieldPaths.forEach(fieldPath => {
      fields[fieldPath] = adminMeta.lists[listKey].fields[fieldPath];
    });
    return fields;
  }, [fieldPaths, adminMeta.lists, listKey]);
  const [value, setValue] = useState(() => {
    const state = {};
    Object.keys(fields).forEach(fieldPath => {
      state[fieldPath] = {
        kind: 'value',
        value: fields[fieldPath].controller.defaultValue
      };
    });
    return state;
  });
  const invalidFields = useInvalidFields(fields, value);
  const [forceValidation, setForceValidation] = useState(false);
  const [mode, setMode] = useState('init');
  const [createFirstItem, {
    loading,
    error,
    data
  }] = useMutation(gql`mutation($data: CreateInitial${listKey}Input!) {
    authenticate: createInitial${listKey}(data: $data) {
      ... on ${listKey}AuthenticationWithPasswordSuccess {
        item {
          id
        }
      }
    }
  }`);
  const reinitContext = useReinitContext();
  const router = useRouter();
  const redirect = useRedirect();
  const onSubmit = async event => {
    event.preventDefault();
    // Check if there are any invalidFields
    const newForceValidation = invalidFields.size !== 0;
    setForceValidation(newForceValidation);

    // if yes, don't submit the form
    if (newForceValidation) return;

    // If not we serialize the data
    const data = {};
    const allSerializedValues = serializeValueToObjByFieldKey(fields, value);
    for (const fieldPath of Object.keys(allSerializedValues)) {
      const {
        controller
      } = fields[fieldPath];
      const serialized = allSerializedValues[fieldPath];
      // we check the serialized values against the default values on the controller
      if (!isDeepEqual(serialized, controller.serialize(controller.defaultValue))) {
        // if they're different add them to the data object.
        Object.assign(data, serialized);
      }
    }
    try {
      await createFirstItem({
        variables: {
          data
        }
      });
    } catch (e) {
      console.error(e);
      return;
    }
    await reinitContext();
    if (enableWelcome) return setMode('welcome');
    router.push(redirect);
  };
  const onComplete = () => {
    router.push(redirect);
  };
  return mode === 'init' ? jsx(SigninContainer, {
    title: "Welcome to KeystoneJS"
  }, jsx(H1, null, "Welcome to KeystoneJS"), jsx("p", null, "Create your first user to get started"), jsx("form", {
    onSubmit: onSubmit
  }, jsx(Stack, {
    gap: "large"
  }, error && jsx(GraphQLErrorNotice, {
    errors: error === null || error === void 0 ? void 0 : error.graphQLErrors,
    networkError: error === null || error === void 0 ? void 0 : error.networkError
  }), jsx(Fields, {
    fields: fields,
    forceValidation: forceValidation,
    invalidFields: invalidFields,
    onChange: setValue,
    value: value
  }), jsx(Button, {
    isLoading: loading || (data === null || data === void 0 || (_data$authenticate = data.authenticate) === null || _data$authenticate === void 0 ? void 0 : _data$authenticate.__typename) === `${listKey}AuthenticationWithPasswordSuccess`,
    type: "submit",
    weight: "bold",
    tone: "active"
  }, "Get started")))) : jsx(SigninContainer, null, jsx(Welcome, {
    value: value,
    onContinue: onComplete
  }));
}
const getInitPage = props => () => jsx(InitPage, props);

export { getInitPage };
