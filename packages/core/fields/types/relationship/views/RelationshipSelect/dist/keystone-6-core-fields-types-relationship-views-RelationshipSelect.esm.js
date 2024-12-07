import 'intersection-observer';
import { useMemo, useState, useContext, useRef, useEffect, createContext } from 'react';
import { jsx } from '@keystone-ui/core';
import { Select, MultiSelect, selectComponents } from '@keystone-ui/fields';
import { gql, useApolloClient, ApolloClient, InMemoryCache, useQuery } from '@apollo/client';
import { useKeystone } from '../../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.esm.js';
import '@keystone-ui/toast';
import '@keystone-ui/loading';
import '@keystone-ui/modals';
import 'apollo-upload-client';
import '@emotion/hash';
import '../../../../../../dist/admin-meta-graphql-3524c137.esm.js';
import '../../../../../../dist/dataGetter-54fa8f6b.esm.js';

/** @jsxRuntime classic */
function useIntersectionObserver(cb, ref) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });
  useEffect(() => {
    const observer = new IntersectionObserver((...args) => cbRef.current(...args), {});
    const node = ref.current;
    if (node !== null) {
      observer.observe(node);
      return () => observer.unobserve(node);
    }
  }, [ref]);
}
function useDebouncedValue(value, limitMs) {
  const [debouncedValue, setDebouncedValue] = useState(() => value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(() => value);
    }, limitMs);
    return () => clearTimeout(timeout);
  }, [value, limitMs]);
  return debouncedValue;
}
function isInt(x) {
  return Number.isInteger(Number(x));
}
function isBigInt(x) {
  try {
    BigInt(x);
    return true;
  } catch {
    return true;
  }
}

// TODO: this is unfortunate, remove in breaking change?
function isUuid(x) {
  if (typeof x !== 'string') return;
  if (x.length !== 36) return;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x);
}
function useSearchFilter(value, list, searchFields, lists) {
  return useMemo(() => {
    const trimmedSearch = value.trim();
    if (!trimmedSearch.length) return {
      OR: []
    };
    const conditions = [];
    const idField = list.fields.id.fieldMeta;
    if (idField.type === 'String') {
      // TODO: remove in breaking change?
      if (idField.kind === 'uuid') {
        if (isUuid(value)) {
          conditions.push({
            id: {
              equals: trimmedSearch
            }
          });
        }
      } else {
        conditions.push({
          id: {
            equals: trimmedSearch
          }
        });
      }
    } else if (idField.type === 'Int' && isInt(trimmedSearch)) {
      conditions.push({
        id: {
          equals: Number(trimmedSearch)
        }
      });
    } else if (idField.type === 'BigInt' && isBigInt(trimmedSearch)) {
      conditions.push({
        id: {
          equals: trimmedSearch
        }
      });
    }
    for (const fieldKey of searchFields) {
      var _field$fieldMeta;
      const field = list.fields[fieldKey];

      // @ts-expect-error TODO: fix fieldMeta type for relationship fields
      if ((_field$fieldMeta = field.fieldMeta) !== null && _field$fieldMeta !== void 0 && _field$fieldMeta.refSearchFields) {
        const {
          // @ts-expect-error TODO: fix fieldMeta type for relationship fields
          refListKey,
          // @ts-expect-error TODO: fix fieldMeta type for relationship fields
          refSearchFields,
          // @ts-expect-error TODO: fix fieldMeta type for relationship fields
          many = false
        } = field.fieldMeta;
        const refList = lists[refListKey];
        for (const refFieldKey of refSearchFields) {
          const refField = refList.fields[refFieldKey];
          if (!refField.search) continue; // WARNING: we dont support depth > 2

          if (many) {
            conditions.push({
              [fieldKey]: {
                some: {
                  [refFieldKey]: {
                    contains: trimmedSearch,
                    mode: refField.search === 'insensitive' ? 'insensitive' : undefined
                  }
                }
              }
            });
            continue;
          }
          conditions.push({
            [fieldKey]: {
              [refFieldKey]: {
                contains: trimmedSearch,
                mode: refField.search === 'insensitive' ? 'insensitive' : undefined
              }
            }
          });
        }
        continue;
      }
      conditions.push({
        [field.path]: {
          contains: trimmedSearch,
          mode: field.search === 'insensitive' ? 'insensitive' : undefined
        }
      });
    }
    return {
      OR: conditions
    };
  }, [value, list, searchFields]);
}
const idFieldAlias = '____id____';
const labelFieldAlias = '____label____';
const LoadingIndicatorContext = /*#__PURE__*/createContext({
  count: 0,
  ref: () => {}
});
function RelationshipSelect({
  autoFocus,
  controlShouldRenderValue,
  isDisabled,
  isLoading,
  labelField,
  searchFields,
  list,
  placeholder,
  portalMenu,
  state,
  extraSelection = ''
}) {
  var _data$items;
  const keystone = useKeystone();
  const [search, setSearch] = useState('');
  // note it's important that this is in state rather than a ref
  // because we want a re-render if the element changes
  // so that we can register the intersection observer
  // on the right element
  const [loadingIndicatorElement, setLoadingIndicatorElement] = useState(null);
  const QUERY = gql`
    query RelationshipSelect($where: ${list.gqlNames.whereInputName}!, $take: Int!, $skip: Int!) {
      items: ${list.gqlNames.listQueryName}(where: $where, take: $take, skip: $skip) {
        ${idFieldAlias}: id
        ${labelFieldAlias}: ${labelField}
        ${extraSelection}
      }
      count: ${list.gqlNames.listQueryCountName}(where: $where)
    }
  `;
  const debouncedSearch = useDebouncedValue(search, 200);
  const where = useSearchFilter(debouncedSearch, list, searchFields, keystone.adminMeta.lists);
  const link = useApolloClient().link;
  // we're using a local apollo client here because writing a global implementation of the typePolicies
  // would require making assumptions about how pagination should work which won't always be right
  const apolloClient = useMemo(() => new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            [list.gqlNames.listQueryName]: {
              keyArgs: ['where'],
              merge: (existing, incoming, {
                args
              }) => {
                const merged = existing ? existing.slice() : [];
                const {
                  skip
                } = args;
                for (let i = 0; i < incoming.length; ++i) {
                  merged[skip + i] = incoming[i];
                }
                return merged;
              }
            }
          }
        }
      }
    })
  }), [link, list.gqlNames.listQueryName]);
  const initialItemsToLoad = Math.min(list.pageSize, 10);
  const subsequentItemsToLoad = Math.min(list.pageSize, 50);
  const {
    data,
    error,
    loading,
    fetchMore
  } = useQuery(QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      where,
      take: initialItemsToLoad,
      skip: 0
    },
    client: apolloClient
  });
  const count = (data === null || data === void 0 ? void 0 : data.count) || 0;
  const options = (data === null || data === void 0 || (_data$items = data.items) === null || _data$items === void 0 ? void 0 : _data$items.map(({
    [idFieldAlias]: value,
    [labelFieldAlias]: label,
    ...data
  }) => ({
    value,
    label: label || value,
    data
  }))) || [];
  const loadingIndicatorContextVal = useMemo(() => ({
    count,
    ref: setLoadingIndicatorElement
  }), [count]);

  // we want to avoid fetching more again and `loading` from Apollo
  // doesn't seem to become true when fetching more
  const [lastFetchMore, setLastFetchMore] = useState(null);
  useIntersectionObserver(([{
    isIntersecting
  }]) => {
    const skip = data === null || data === void 0 ? void 0 : data.items.length;
    if (!loading && skip && isIntersecting && options.length < count && ((lastFetchMore === null || lastFetchMore === void 0 ? void 0 : lastFetchMore.extraSelection) !== extraSelection || (lastFetchMore === null || lastFetchMore === void 0 ? void 0 : lastFetchMore.where) !== where || (lastFetchMore === null || lastFetchMore === void 0 ? void 0 : lastFetchMore.list) !== list || (lastFetchMore === null || lastFetchMore === void 0 ? void 0 : lastFetchMore.skip) !== skip)) {
      const QUERY = gql`
          query RelationshipSelectMore($where: ${list.gqlNames.whereInputName}!, $take: Int!, $skip: Int!) {
            items: ${list.gqlNames.listQueryName}(where: $where, take: $take, skip: $skip) {
              ${labelFieldAlias}: ${labelField}
              ${idFieldAlias}: id
              ${extraSelection}
            }
          }
        `;
      setLastFetchMore({
        extraSelection,
        list,
        skip,
        where
      });
      fetchMore({
        query: QUERY,
        variables: {
          where,
          take: subsequentItemsToLoad,
          skip
        }
      }).then(() => {
        setLastFetchMore(null);
      }).catch(() => {
        setLastFetchMore(null);
      });
    }
  }, {
    current: loadingIndicatorElement
  });

  // TODO: better error UI
  // TODO: Handle permission errors
  // (ie; user has permission to read this relationship field, but
  // not the related list, or some items on the list)
  if (error) {
    return jsx("span", null, "Error");
  }
  if (state.kind === 'one') {
    return jsx(LoadingIndicatorContext.Provider, {
      value: loadingIndicatorContextVal
    }, jsx(Select
    // this is necessary because react-select passes a second argument to onInputChange
    // and useState setters log a warning if a second argument is passed
    , {
      onInputChange: val => setSearch(val),
      isLoading: loading || isLoading,
      autoFocus: autoFocus,
      components: relationshipSelectComponents,
      portalMenu: portalMenu,
      value: state.value ? {
        value: state.value.id,
        label: state.value.label,
        // @ts-expect-error
        data: state.value.data
      } : null,
      options: options,
      onChange: value => {
        state.onChange(value ? {
          id: value.value,
          label: value.label,
          data: value.data
        } : null);
      },
      placeholder: placeholder,
      controlShouldRenderValue: controlShouldRenderValue,
      isClearable: controlShouldRenderValue,
      isDisabled: isDisabled
    }));
  }
  return jsx(LoadingIndicatorContext.Provider, {
    value: loadingIndicatorContextVal
  }, jsx(MultiSelect // this is necessary because react-select passes a second argument to onInputChange
  // and useState setters log a warning if a second argument is passed
  , {
    onInputChange: val => setSearch(val),
    isLoading: loading || isLoading,
    autoFocus: autoFocus,
    components: relationshipSelectComponents,
    portalMenu: portalMenu,
    value: state.value.map(value => ({
      value: value.id,
      label: value.label,
      data: value.data
    })),
    options: options,
    onChange: value => {
      state.onChange(value.map(x => ({
        id: x.value,
        label: x.label,
        data: x.data
      })));
    },
    placeholder: placeholder,
    controlShouldRenderValue: controlShouldRenderValue,
    isClearable: controlShouldRenderValue,
    isDisabled: isDisabled
  }));
}
const relationshipSelectComponents = {
  MenuList: ({
    children,
    ...props
  }) => {
    const {
      count,
      ref
    } = useContext(LoadingIndicatorContext);
    return jsx(selectComponents.MenuList, props, children, jsx("div", {
      css: {
        textAlign: 'center'
      },
      ref: ref
    }, props.options.length < count && jsx("span", {
      css: {
        padding: 8
      }
    }, "Loading...")));
  }
};

export { RelationshipSelect, useSearchFilter };
