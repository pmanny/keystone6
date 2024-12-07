'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var core = require('@keystone-ui/core');
var button = require('@keystone-ui/button');
var fields = require('@keystone-ui/fields');
var notice = require('@keystone-ui/notice');
var apollo = require('@keystone-6/core/admin-ui/apollo');
var context = require('@keystone-6/core/admin-ui/context');
var router = require('@keystone-6/core/admin-ui/router');
var useFromRedirect = require('../../../dist/useFromRedirect-ac8110d1.cjs.prod.js');

/** @jsxRuntime classic */
const getSigninPage = props => () => core.jsx(SigninPage, props);
function SigninPage({
  identityField,
  secretField,
  mutationName,
  successTypename,
  failureTypename
}) {
  var _data$authenticate2, _data$authenticate3;
  const mutation = apollo.gql`
    mutation($identity: String!, $secret: String!) {
      authenticate: ${mutationName}(${identityField}: $identity, ${secretField}: $secret) {
        ... on ${successTypename} {
          item {
            id
          }
        }
        ... on ${failureTypename} {
          message
        }
      }
    }
  `;
  const [mode, setMode] = react.useState('signin');
  const [state, setState] = react.useState({
    identity: '',
    secret: ''
  });
  const [submitted, setSubmitted] = react.useState(false);
  const identityFieldRef = react.useRef(null);
  react.useEffect(() => {
    var _identityFieldRef$cur;
    (_identityFieldRef$cur = identityFieldRef.current) === null || _identityFieldRef$cur === void 0 || _identityFieldRef$cur.focus();
  }, [mode]);
  const [mutate, {
    error,
    loading,
    data
  }] = apollo.useMutation(mutation);
  const reinitContext = context.useReinitContext();
  const router$1 = router.useRouter();
  const rawKeystone = context.useRawKeystone();
  const redirect = useFromRedirect.useRedirect();

  // if we are signed in, redirect immediately
  react.useEffect(() => {
    if (submitted) return;
    if (rawKeystone.authenticatedItem.state === 'authenticated') {
      router$1.push(redirect);
    }
  }, [rawKeystone.authenticatedItem, router$1, redirect, submitted]);
  react.useEffect(() => {
    var _rawKeystone$adminMet;
    if (!submitted) return;

    // TODO: this is horrible, we need to resolve this mess
    // @ts-expect-error
    if (((_rawKeystone$adminMet = rawKeystone.adminMeta) === null || _rawKeystone$adminMet === void 0 || (_rawKeystone$adminMet = _rawKeystone$adminMet.error) === null || _rawKeystone$adminMet === void 0 ? void 0 : _rawKeystone$adminMet.message) === 'Access denied') {
      router$1.push('/no-access');
      return;
    }
    router$1.push(redirect);
  }, [rawKeystone.adminMeta, router$1, redirect, submitted]);
  const onSubmit = async event => {
    event.preventDefault();
    if (mode !== 'signin') return;
    try {
      var _data$authenticate;
      const {
        data
      } = await mutate({
        variables: {
          identity: state.identity,
          secret: state.secret
        }
      });
      if (((_data$authenticate = data.authenticate) === null || _data$authenticate === void 0 ? void 0 : _data$authenticate.__typename) !== successTypename) return;
    } catch (e) {
      console.error(e);
      return;
    }
    await reinitContext();
    setSubmitted(true);
  };
  return core.jsx(useFromRedirect.SigninContainer, {
    title: "Keystone - Sign in"
  }, core.jsx(core.Stack, {
    gap: "xlarge",
    as: "form",
    onSubmit: onSubmit
  }, core.jsx(core.H1, null, "Sign In"), error && core.jsx(notice.Notice, {
    title: "Error",
    tone: "negative"
  }, error.message), (data === null || data === void 0 || (_data$authenticate2 = data.authenticate) === null || _data$authenticate2 === void 0 ? void 0 : _data$authenticate2.__typename) === failureTypename && core.jsx(notice.Notice, {
    title: "Error",
    tone: "negative"
  }, data === null || data === void 0 ? void 0 : data.authenticate.message), core.jsx(core.Stack, {
    gap: "medium"
  }, core.jsx(core.VisuallyHidden, {
    as: "label",
    htmlFor: "identity"
  }, identityField), core.jsx(fields.TextInput, {
    id: "identity",
    name: "identity",
    value: state.identity,
    onChange: e => setState({
      ...state,
      identity: e.target.value
    }),
    placeholder: identityField,
    ref: identityFieldRef
  }), mode === 'signin' && core.jsx(react.Fragment, null, core.jsx(core.VisuallyHidden, {
    as: "label",
    htmlFor: "password"
  }, secretField), core.jsx(fields.TextInput, {
    id: "password",
    name: "password",
    value: state.secret,
    onChange: e => setState({
      ...state,
      secret: e.target.value
    }),
    placeholder: secretField,
    type: "password"
  }))), mode === 'forgot password' ? core.jsx(core.Stack, {
    gap: "medium",
    across: true
  }, core.jsx(button.Button, {
    type: "submit",
    weight: "bold",
    tone: "active"
  }, "Log reset link"), core.jsx(button.Button, {
    weight: "none",
    tone: "active",
    onClick: () => setMode('signin')
  }, "Go back")) : core.jsx(core.Stack, {
    gap: "medium",
    across: true
  }, core.jsx(button.Button, {
    weight: "bold",
    tone: "active",
    isLoading: loading ||
    // this is for while the page is loading but the mutation has finished successfully
    (data === null || data === void 0 || (_data$authenticate3 = data.authenticate) === null || _data$authenticate3 === void 0 ? void 0 : _data$authenticate3.__typename) === successTypename,
    type: "submit"
  }, "Sign in"))));
}

exports.SigninPage = SigninPage;
exports.getSigninPage = getSigninPage;
