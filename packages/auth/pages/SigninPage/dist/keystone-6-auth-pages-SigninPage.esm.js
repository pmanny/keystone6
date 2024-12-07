import { useState, useRef, useEffect, Fragment } from 'react';
import { jsx, Stack, H1, VisuallyHidden } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { TextInput } from '@keystone-ui/fields';
import { Notice } from '@keystone-ui/notice';
import { gql, useMutation } from '@keystone-6/core/admin-ui/apollo';
import { useReinitContext, useRawKeystone } from '@keystone-6/core/admin-ui/context';
import { useRouter } from '@keystone-6/core/admin-ui/router';
import { u as useRedirect, S as SigninContainer } from '../../../dist/useFromRedirect-6af2ab2b.esm.js';

/** @jsxRuntime classic */
const getSigninPage = props => () => jsx(SigninPage, props);
function SigninPage({
  identityField,
  secretField,
  mutationName,
  successTypename,
  failureTypename
}) {
  var _data$authenticate2, _data$authenticate3;
  const mutation = gql`
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
  const [mode, setMode] = useState('signin');
  const [state, setState] = useState({
    identity: '',
    secret: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const identityFieldRef = useRef(null);
  useEffect(() => {
    var _identityFieldRef$cur;
    (_identityFieldRef$cur = identityFieldRef.current) === null || _identityFieldRef$cur === void 0 || _identityFieldRef$cur.focus();
  }, [mode]);
  const [mutate, {
    error,
    loading,
    data
  }] = useMutation(mutation);
  const reinitContext = useReinitContext();
  const router = useRouter();
  const rawKeystone = useRawKeystone();
  const redirect = useRedirect();

  // if we are signed in, redirect immediately
  useEffect(() => {
    if (submitted) return;
    if (rawKeystone.authenticatedItem.state === 'authenticated') {
      router.push(redirect);
    }
  }, [rawKeystone.authenticatedItem, router, redirect, submitted]);
  useEffect(() => {
    var _rawKeystone$adminMet;
    if (!submitted) return;

    // TODO: this is horrible, we need to resolve this mess
    // @ts-expect-error
    if (((_rawKeystone$adminMet = rawKeystone.adminMeta) === null || _rawKeystone$adminMet === void 0 || (_rawKeystone$adminMet = _rawKeystone$adminMet.error) === null || _rawKeystone$adminMet === void 0 ? void 0 : _rawKeystone$adminMet.message) === 'Access denied') {
      router.push('/no-access');
      return;
    }
    router.push(redirect);
  }, [rawKeystone.adminMeta, router, redirect, submitted]);
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
  return jsx(SigninContainer, {
    title: "Keystone - Sign in"
  }, jsx(Stack, {
    gap: "xlarge",
    as: "form",
    onSubmit: onSubmit
  }, jsx(H1, null, "Sign In"), error && jsx(Notice, {
    title: "Error",
    tone: "negative"
  }, error.message), (data === null || data === void 0 || (_data$authenticate2 = data.authenticate) === null || _data$authenticate2 === void 0 ? void 0 : _data$authenticate2.__typename) === failureTypename && jsx(Notice, {
    title: "Error",
    tone: "negative"
  }, data === null || data === void 0 ? void 0 : data.authenticate.message), jsx(Stack, {
    gap: "medium"
  }, jsx(VisuallyHidden, {
    as: "label",
    htmlFor: "identity"
  }, identityField), jsx(TextInput, {
    id: "identity",
    name: "identity",
    value: state.identity,
    onChange: e => setState({
      ...state,
      identity: e.target.value
    }),
    placeholder: identityField,
    ref: identityFieldRef
  }), mode === 'signin' && jsx(Fragment, null, jsx(VisuallyHidden, {
    as: "label",
    htmlFor: "password"
  }, secretField), jsx(TextInput, {
    id: "password",
    name: "password",
    value: state.secret,
    onChange: e => setState({
      ...state,
      secret: e.target.value
    }),
    placeholder: secretField,
    type: "password"
  }))), mode === 'forgot password' ? jsx(Stack, {
    gap: "medium",
    across: true
  }, jsx(Button, {
    type: "submit",
    weight: "bold",
    tone: "active"
  }, "Log reset link"), jsx(Button, {
    weight: "none",
    tone: "active",
    onClick: () => setMode('signin')
  }, "Go back")) : jsx(Stack, {
    gap: "medium",
    across: true
  }, jsx(Button, {
    weight: "bold",
    tone: "active",
    isLoading: loading ||
    // this is for while the page is loading but the mutation has finished successfully
    (data === null || data === void 0 || (_data$authenticate3 = data.authenticate) === null || _data$authenticate3 === void 0 ? void 0 : _data$authenticate3.__typename) === successTypename,
    type: "submit"
  }, "Sign in"))));
}

export { SigninPage, getSigninPage };
