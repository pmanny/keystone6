'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var React = require('react');
var button = require('@keystone-ui/button');
var core = require('@keystone-ui/core');
var fields = require('@keystone-ui/fields');
var ArrowRightCircleIcon = require('@keystone-ui/icons/icons/ArrowRightCircleIcon');
var loading = require('@keystone-ui/loading');
var modals = require('@keystone-ui/modals');
var toast = require('@keystone-ui/toast');
var SearchIcon = require('@keystone-ui/icons/icons/SearchIcon');
var dataGetter = require('../../../../../dist/dataGetter-2824eb60.cjs.prod.js');
require('../../../../../dist/Fields-7213b21d.cjs.prod.js');
var getRootGraphQLFieldsFromFieldController = require('../../../../../dist/getRootGraphQLFieldsFromFieldController-96ccad4c.cjs.prod.js');
require('fast-deep-equal');
var client = require('@apollo/client');
var CellLink = require('../../../../../dist/CellLink-76b148c8.cjs.prod.js');
require('@babel/runtime/helpers/defineProperty');
require('@keystone-ui/icons/icons/AlertTriangleIcon');
require('next/link');
var adminUi_context_dist_keystone6CoreAdminUiContext = require('../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.cjs.prod.js');
var router = require('next/router');
var popover = require('@keystone-ui/popover');
require('@keystone-ui/icons/icons/MoreHorizontalIcon');
var ChevronRightIcon = require('@keystone-ui/icons/icons/ChevronRightIcon');
var adminUi_router_dist_keystone6CoreAdminUiRouter = require('../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.cjs.prod.js');
require('../../../../../dist/SignoutButton-777de56f.cjs.prod.js');
var PageContainer = require('../../../../../dist/PageContainer-ec7caac3.cjs.prod.js');
var GraphQLErrorNotice = require('../../../../../dist/GraphQLErrorNotice-1318ffa7.cjs.prod.js');
var Pagination = require('../../../../../dist/Pagination-60251f24.cjs.prod.js');
var fields_types_relationship_views_RelationshipSelect_dist_keystone6CoreFieldsTypesRelationshipViewsRelationshipSelect = require('../../../../../fields/types/relationship/views/RelationshipSelect/dist/keystone-6-core-fields-types-relationship-views-RelationshipSelect.cjs.prod.js');
var CreateButtonLink = require('../../../../../dist/CreateButtonLink-2e6a33e1.cjs.prod.js');
var ChevronDownIcon = require('@keystone-ui/icons/icons/ChevronDownIcon');
var options = require('@keystone-ui/options');
require('next/head');
var ChevronLeftIcon = require('@keystone-ui/icons/icons/ChevronLeftIcon');
var pill = require('@keystone-ui/pill');
require('@emotion/weak-memoize');
require('graphql');
require('apollo-upload-client');
require('@emotion/hash');
require('../../../../../dist/admin-meta-graphql-ea267ea5.cjs.prod.js');
require('@keystone-ui/icons');
require('@keystone-ui/notice');
require('intersection-observer');

function useSelectedFields(list, fieldModesByFieldPath) {
  const {
    query
  } = router.useRouter();
  const selectedFieldsFromUrl = typeof query.fields === 'string' ? query.fields : '';
  return React.useMemo(() => {
    const selectedFieldsArray = selectedFieldsFromUrl ? selectedFieldsFromUrl.split(',') : list.initialColumns;
    const fields = selectedFieldsArray.filter(field => {
      return fieldModesByFieldPath[field] === 'read';
    });
    return new Set(fields.length === 0 ? [list.labelField] : fields);
  }, [list, selectedFieldsFromUrl, fieldModesByFieldPath]);
}

function isArrayEqual(arrA, arrB) {
  if (arrA.length !== arrB.length) return false;
  for (let i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }
  return true;
}
const Option = props => {
  return core.jsx(options.OptionPrimitive, props, props.children, core.jsx(options.CheckMark, {
    isDisabled: props.isDisabled,
    isFocused: props.isFocused,
    isSelected: props.isSelected
  }));
};

// TODO: return type required by pnpm :(
const fieldSelectionOptionsComponents = {
  Option
};
function FieldSelection({
  list,
  fieldModesByFieldPath
}) {
  const router$1 = router.useRouter();
  const selectedFields = useSelectedFields(list, fieldModesByFieldPath);
  const setNewSelectedFields = selectedFields => {
    if (isArrayEqual(selectedFields, list.initialColumns)) {
      const {
        fields: _ignore,
        ...otherQueryFields
      } = router$1.query;
      router$1.push({
        query: otherQueryFields
      });
    } else {
      router$1.push({
        query: {
          ...router$1.query,
          fields: selectedFields.join(',')
        }
      });
    }
  };
  const fields = [];
  Object.keys(fieldModesByFieldPath).forEach(fieldPath => {
    if (fieldModesByFieldPath[fieldPath] === 'read') {
      fields.push({
        value: fieldPath,
        label: list.fields[fieldPath].label,
        isDisabled: selectedFields.size === 1 && selectedFields.has(fieldPath)
      });
    }
  });
  return core.jsx(popover.Popover, {
    "aria-label": `Columns options, list of column options to apply to the ${list.key} list`,
    triggerRenderer: ({
      triggerProps
    }) => {
      return core.jsx(button.Button, _extends({
        weight: "link",
        css: {
          padding: 4
        }
      }, triggerProps), core.jsx("span", {
        css: {
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }, selectedFields.size, " column", selectedFields.size === 1 ? '' : 's', ' ', core.jsx(ChevronDownIcon.ChevronDownIcon, {
        size: "smallish"
      })));
    }
  }, core.jsx("div", {
    css: {
      width: 320
    }
  }, core.jsx(core.Box, {
    padding: "medium"
  }, core.jsx(options.Options, {
    onChange: options => {
      if (!Array.isArray(options)) return;
      setNewSelectedFields(options.map(x => x.value));
    },
    isMulti: true,
    value: fields.filter(option => selectedFields.has(option.value)),
    options: fields,
    components: fieldSelectionOptionsComponents
  }))));
}

const fieldSelectComponents = {
  Option: ({
    children,
    ...props
  }) => {
    const theme = core.useTheme();
    const iconColor = props.isFocused ? theme.colors.foreground : theme.colors.foregroundDim;
    return core.jsx(options.OptionPrimitive, props, core.jsx("span", null, children), core.jsx("div", {
      css: {
        alignItems: 'center',
        display: 'flex',
        height: 24,
        justifyContent: 'center',
        width: 24
      }
    }, core.jsx(ChevronRightIcon.ChevronRightIcon, {
      css: {
        color: iconColor
      }
    })));
  }
};
function FilterAdd({
  listKey,
  filterableFields
}) {
  const {
    isOpen,
    setOpen,
    trigger,
    dialog,
    arrow
  } = popover.usePopover({
    placement: 'bottom',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  return core.jsx(React.Fragment, null, core.jsx(button.Button, _extends({
    tone: "active"
  }, trigger.props, {
    ref: trigger.ref,
    onClick: () => setOpen(!isOpen)
  }), core.jsx(core.Box, {
    as: "span",
    marginRight: "xsmall"
  }, "Filter List"), core.jsx(ChevronDownIcon.ChevronDownIcon, {
    size: "small"
  })), core.jsx(popover.PopoverDialog, _extends({
    "aria-label": `Filters options, list of filters to apply to the ${listKey} list`,
    arrow: arrow,
    isVisible: isOpen
  }, dialog.props, {
    ref: dialog.ref
  }), isOpen && core.jsx(FilterAddPopoverContent, {
    onClose: () => {
      setOpen(false);
    },
    listKey: listKey,
    filterableFields: filterableFields
  })));
}
function FilterAddPopoverContent({
  onClose,
  listKey,
  filterableFields
}) {
  const list = adminUi_context_dist_keystone6CoreAdminUiContext.useList(listKey);
  const router$1 = router.useRouter();
  const fieldsWithFilters = React.useMemo(() => {
    const fieldsWithFilters = {};
    Object.keys(list.fields).forEach(fieldPath => {
      const field = list.fields[fieldPath];
      if (filterableFields.has(fieldPath) && field.controller.filter) {
        fieldsWithFilters[fieldPath] = field;
      }
    });
    return fieldsWithFilters;
  }, [list.fields, filterableFields]);
  const filtersByFieldThenType = React.useMemo(() => {
    const filtersByFieldThenType = {};
    Object.keys(fieldsWithFilters).forEach(fieldPath => {
      const field = fieldsWithFilters[fieldPath];
      let hasUnusedFilters = false;
      const filters = {};
      Object.keys(field.controller.filter.types).forEach(filterType => {
        if (router$1.query[`!${fieldPath}_${filterType}`] === undefined) {
          hasUnusedFilters = true;
          filters[filterType] = field.controller.filter.types[filterType].label;
        }
      });
      if (hasUnusedFilters) {
        filtersByFieldThenType[fieldPath] = filters;
      }
    });
    return filtersByFieldThenType;
  }, [router$1.query, fieldsWithFilters]);
  const [state, setState] = React.useState({
    kind: 'selecting-field'
  });
  return core.jsx(core.Stack, {
    padding: "medium",
    as: "form",
    css: {
      minWidth: 320
    },
    onSubmit: event => {
      event.preventDefault();
      if (state.kind === 'filter-value') {
        router$1.push({
          query: {
            ...router$1.query,
            [`!${state.fieldPath}_${state.filterType}`]: JSON.stringify(state.filterValue)
          }
        });
        onClose();
      }
    },
    gap: "small"
  }, core.jsx("div", {
    css: {
      position: 'relative'
    }
  }, state.kind !== 'selecting-field' && core.jsx("button", {
    type: "button",
    onClick: () => {
      setState({
        kind: 'selecting-field'
      });
    },
    css: {
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      position: 'absolute'
    }
  }, core.jsx(core.VisuallyHidden, null, "Back"), core.jsx(ChevronLeftIcon.ChevronLeftIcon, {
    size: "smallish"
  })), core.jsx(core.Heading, {
    textAlign: "center",
    type: "h5"
  }, (() => {
    switch (state.kind) {
      case 'selecting-field':
        {
          return 'Filter';
        }
      case 'filter-value':
        {
          return list.fields[state.fieldPath].label;
        }
    }
  })())), core.jsx(core.Divider, null), state.kind === 'selecting-field' && core.jsx(options.Options, {
    components: fieldSelectComponents,
    onChange: newVal => {
      const fieldPath = newVal.value;
      const filterType = Object.keys(filtersByFieldThenType[fieldPath])[0];
      setState({
        kind: 'filter-value',
        fieldPath,
        filterType,
        filterValue: fieldsWithFilters[fieldPath].controller.filter.types[filterType].initialValue
      });
    },
    options: Object.keys(filtersByFieldThenType).map(fieldPath => ({
      label: fieldsWithFilters[fieldPath].label,
      value: fieldPath
    }))
  }), state.kind === 'filter-value' && core.jsx(fields.Select, {
    width: "full",
    value: {
      value: state.filterType,
      label: filtersByFieldThenType[state.fieldPath][state.filterType]
    },
    onChange: newVal => {
      if (newVal) {
        setState({
          kind: 'filter-value',
          fieldPath: state.fieldPath,
          filterValue: fieldsWithFilters[state.fieldPath].controller.filter.types[newVal.value].initialValue,
          filterType: newVal.value
        });
      }
    },
    options: Object.keys(filtersByFieldThenType[state.fieldPath]).map(filterType => ({
      label: filtersByFieldThenType[state.fieldPath][filterType],
      value: filterType
    }))
  }), state.kind == 'filter-value' && (() => {
    const {
      Filter
    } = fieldsWithFilters[state.fieldPath].controller.filter;
    return core.jsx(Filter, {
      type: state.filterType,
      value: state.filterValue,
      onChange: value => {
        setState(state => ({
          ...state,
          filterValue: value
        }));
      }
    });
  })(), state.kind == 'filter-value' && core.jsx("div", {
    css: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, core.jsx(button.Button, {
    onClick: onClose
  }, "Cancel"), core.jsx(button.Button, {
    type: "submit"
  }, "Apply")));
}

function FilterList({
  filters,
  list
}) {
  return core.jsx(core.Inline, {
    gap: "small"
  }, filters.map(filter => {
    const field = list.fields[filter.field];
    return core.jsx(FilterPill, {
      key: `${filter.field}_${filter.type}`,
      field: field,
      filter: filter
    });
  }));
}
function FilterPill({
  filter,
  field
}) {
  const router$1 = router.useRouter();
  const {
    isOpen,
    setOpen,
    trigger,
    dialog,
    arrow
  } = popover.usePopover({
    placement: 'bottom',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  // doing this because returning a string from Label will be VERY common
  // but https://github.com/microsoft/TypeScript/issues/21699 isn't resolved yet
  const Label = field.controller.filter.Label;
  return core.jsx(React.Fragment, null, core.jsx(pill.Pill, _extends({
    containerProps: {
      'aria-label': `Filter item ${filter.field}, press to edit filter`
    }
  }, trigger.props, {
    ref: trigger.ref,
    onClick: () => setOpen(!isOpen),
    weight: "light",
    tone: "passive",
    onRemove: () => {
      const {
        [`!${filter.field}_${filter.type}`]: _ignore,
        ...queryToKeep
      } = router$1.query;
      router$1.push({
        pathname: router$1.pathname,
        query: queryToKeep
      });
    }
  }), field.label, ' ', core.jsx(Label, {
    label: field.controller.filter.types[filter.type].label,
    type: filter.type,
    value: filter.value
  })), core.jsx(popover.PopoverDialog, _extends({
    "aria-label": `filter item config, dialog for configuring ${filter.field} filter`,
    arrow: arrow
  }, dialog.props, {
    isVisible: isOpen,
    ref: dialog.ref
  }), isOpen && core.jsx(EditDialog, {
    onClose: () => {
      setOpen(false);
    },
    field: field,
    filter: filter
  })));
}
function EditDialog({
  filter,
  field,
  onClose
}) {
  const Filter = field.controller.filter.Filter;
  const router$1 = router.useRouter();
  const [value, setValue] = React.useState(filter.value);
  return core.jsx(core.Stack, {
    as: "form",
    padding: "small",
    gap: "small",
    onSubmit: event => {
      event.preventDefault();
      router$1.push({
        query: {
          ...router$1.query,
          [`!${filter.field}_${filter.type}`]: JSON.stringify(value)
        }
      });
      onClose();
    }
  }, core.jsx(Filter, {
    type: filter.type,
    value: value,
    onChange: setValue
  }), core.jsx("div", {
    css: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, core.jsx(button.Button, {
    onClick: onClose
  }, "Cancel"), core.jsx(button.Button, {
    type: "submit"
  }, "Save")));
}

function useSort(list, orderableFields) {
  const {
    query
  } = router.useRouter();
  const sortByFromUrl = typeof query.sortBy === 'string' ? query.sortBy : null;
  return React.useMemo(() => {
    if (sortByFromUrl === '') return null;
    if (sortByFromUrl === null) return list.initialSort;
    if (sortByFromUrl.startsWith('-')) {
      const field = sortByFromUrl.slice(1);
      if (!orderableFields.has(field)) return null;
      return {
        field,
        direction: 'DESC'
      };
    }
    if (!orderableFields.has(sortByFromUrl)) return null;
    return {
      field: sortByFromUrl,
      direction: 'ASC'
    };
  }, [sortByFromUrl, list, orderableFields]);
}

function SortSelection({
  list,
  orderableFields
}) {
  const sort = useSort(list, orderableFields);
  const {
    isOpen,
    setOpen,
    trigger,
    dialog,
    arrow
  } = popover.usePopover({
    placement: 'bottom',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 8]
      }
    }]
  });
  return core.jsx(React.Fragment, null, core.jsx(button.Button, _extends({}, trigger.props, {
    weight: "link",
    css: {
      padding: 4
    },
    ref: trigger.ref,
    onClick: () => setOpen(!isOpen)
  }), core.jsx("span", {
    css: {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, sort ? `${list.fields[sort.field].label} ${{
    ASC: 'ascending',
    DESC: 'descending'
  }[sort.direction]}` : 'No field', core.jsx(ChevronDownIcon.ChevronDownIcon, {
    size: "smallish"
  }))), core.jsx(popover.PopoverDialog, _extends({
    "aria-label": `Sort options, list of sorting parameters to apply to the ${list.key} list`,
    arrow: arrow,
    isVisible: isOpen
  }, dialog.props, {
    ref: dialog.ref
  }), isOpen && core.jsx(SortSelectionPopoverContent, {
    onClose: () => {
      setOpen(false);
    },
    list: list,
    orderableFields: orderableFields
  })));
}
const noFieldOption = {
  label: 'No field',
  value: '___________NO_FIELD___________'
};
function SortSelectionPopoverContent({
  onClose,
  list,
  orderableFields
}) {
  const sort = useSort(list, orderableFields);
  const router$1 = router.useRouter();
  return core.jsx(core.Stack, {
    padding: "medium",
    css: {
      minWidth: 320
    },
    gap: "small"
  }, core.jsx("div", {
    css: {
      position: 'relative'
    }
  }, core.jsx(core.Heading, {
    textAlign: "center",
    type: "h5"
  }, "Sort")), core.jsx(core.Divider, null), core.jsx(options.Options, {
    value: sort ? {
      label: list.fields[sort.field].label,
      value: sort.field
    } : noFieldOption,
    components: fieldSelectionOptionsComponents,
    onChange: newVal => {
      const fieldPath = newVal.value;
      if (fieldPath === noFieldOption.value) {
        const {
          sortBy,
          ...restOfQuery
        } = router$1.query;
        if (list.initialSort) {
          router$1.push({
            query: {
              ...router$1.query,
              sortBy: ''
            }
          });
        } else {
          router$1.push({
            query: restOfQuery
          });
        }
      } else {
        router$1.push({
          query: {
            ...router$1.query,
            sortBy: (sort === null || sort === void 0 ? void 0 : sort.field) === fieldPath && sort.direction === 'ASC' ? `-${sort.field}` : fieldPath
          }
        });
      }
      onClose();
    },
    options: [...orderableFields].map(fieldPath => ({
      label: list.fields[fieldPath].label,
      value: fieldPath
    })).concat(noFieldOption)
  }));
}

function useFilters(list, filterableFields) {
  const {
    query
  } = router.useRouter();
  const possibleFilters = React.useMemo(() => {
    const possibleFilters = {};
    Object.entries(list.fields).forEach(([fieldPath, field]) => {
      if (field.controller.filter && filterableFields.has(fieldPath)) {
        Object.keys(field.controller.filter.types).forEach(type => {
          possibleFilters[`!${fieldPath}_${type}`] = {
            type,
            field: fieldPath
          };
        });
      }
    });
    return possibleFilters;
  }, [list, filterableFields]);
  const filters = React.useMemo(() => {
    const filters = [];
    Object.keys(query).forEach(key => {
      const filter = possibleFilters[key];
      const val = query[key];
      if (filter && typeof val === 'string') {
        let value;
        try {
          value = JSON.parse(val);
        } catch (err) {}
        if (val !== undefined) {
          filters.push({
            ...filter,
            value
          });
        }
      }
    });
    const where = filters.reduce((_where, filter) => {
      return Object.assign(_where, list.fields[filter.field].controller.filter.graphql({
        type: filter.type,
        value: filter.value
      }));
    }, {});
    if (list.isSingleton) return {
      filters,
      where: {
        id: {
          equals: 1
        },
        AND: [where]
      }
    };
    return {
      filters,
      where
    };
  }, [query, possibleFilters, list]);
  return filters;
}

const listMetaGraphqlQuery = client.gql`
  query ($listKey: String!) {
    keystone {
      adminMeta {
        list(key: $listKey) {
          hideDelete
          hideCreate
          fields {
            path
            isOrderable
            isFilterable
            listView {
              fieldMode
            }
          }
        }
      }
    }
  }
`;
const storeableQueries = ['sortBy', 'fields'];
function useQueryParamsFromLocalStorage(listKey) {
  const router$1 = router.useRouter();
  const localStorageKey = `keystone.list.${listKey}.list.page.info`;
  const resetToDefaults = () => {
    localStorage.removeItem(localStorageKey);
    router$1.replace({
      pathname: router$1.pathname
    });
  };

  // GET QUERY FROM CACHE IF CONDITIONS ARE RIGHT
  // MERGE QUERY PARAMS FROM CACHE WITH QUERY PARAMS FROM ROUTER
  React.useEffect(() => {
    const hasSomeQueryParamsWhichAreAboutListPage = Object.keys(router$1.query).some(x => {
      return x.startsWith('!') || storeableQueries.includes(x);
    });
    if (!hasSomeQueryParamsWhichAreAboutListPage && router$1.isReady) {
      const queryParamsFromLocalStorage = localStorage.getItem(localStorageKey);
      let parsed;
      try {
        parsed = JSON.parse(queryParamsFromLocalStorage);
      } catch (err) {}
      if (parsed) {
        router$1.replace({
          query: {
            ...router$1.query,
            ...parsed
          }
        });
      }
    }
  }, [localStorageKey, router$1.isReady]);
  React.useEffect(() => {
    const queryParamsToSerialize = {};
    Object.keys(router$1.query).forEach(key => {
      if (key.startsWith('!') || storeableQueries.includes(key)) {
        queryParamsToSerialize[key] = router$1.query[key];
      }
    });
    if (Object.keys(queryParamsToSerialize).length) {
      localStorage.setItem(localStorageKey, JSON.stringify(queryParamsToSerialize));
    } else {
      localStorage.removeItem(localStorageKey);
    }
  }, [localStorageKey, router$1]);
  return {
    resetToDefaults
  };
}
const getListPage = props => () => core.jsx(ListPage, props);
function ListPage({
  listKey
}) {
  var _metaQuery$data2, _metaQuery$data$keyst, _metaQuery$data3;
  const keystone = adminUi_context_dist_keystone6CoreAdminUiContext.useKeystone();
  const list = adminUi_context_dist_keystone6CoreAdminUiContext.useList(listKey);
  const {
    query,
    push
  } = router.useRouter();
  const {
    resetToDefaults
  } = useQueryParamsFromLocalStorage(listKey);
  const {
    currentPage,
    pageSize
  } = Pagination.usePaginationParams({
    defaultPageSize: list.pageSize
  });
  const metaQuery = client.useQuery(listMetaGraphqlQuery, {
    variables: {
      listKey
    }
  });
  const {
    listViewFieldModesByField,
    filterableFields,
    orderableFields
  } = React.useMemo(() => {
    const listViewFieldModesByField = {};
    const orderableFields = new Set();
    const filterableFields = new Set();
    for (const field of ((_metaQuery$data = metaQuery.data) === null || _metaQuery$data === void 0 || (_metaQuery$data = _metaQuery$data.keystone.adminMeta.list) === null || _metaQuery$data === void 0 ? void 0 : _metaQuery$data.fields) || []) {
      var _metaQuery$data;
      listViewFieldModesByField[field.path] = field.listView.fieldMode;
      if (field.isOrderable) {
        orderableFields.add(field.path);
      }
      if (field.isFilterable) {
        filterableFields.add(field.path);
      }
    }
    return {
      listViewFieldModesByField,
      orderableFields,
      filterableFields
    };
  }, [(_metaQuery$data2 = metaQuery.data) === null || _metaQuery$data2 === void 0 || (_metaQuery$data2 = _metaQuery$data2.keystone.adminMeta.list) === null || _metaQuery$data2 === void 0 ? void 0 : _metaQuery$data2.fields]);
  const sort = useSort(list, orderableFields);
  const filters = useFilters(list, filterableFields);
  const searchLabels = list.initialSearchFields.map(key => list.fields[key].label);
  const searchParam = typeof query.search === 'string' ? query.search : '';
  const [searchString, updateSearchString] = React.useState(searchParam);
  const search = fields_types_relationship_views_RelationshipSelect_dist_keystone6CoreFieldsTypesRelationshipViewsRelationshipSelect.useSearchFilter(searchParam, list, list.initialSearchFields, keystone.adminMeta.lists);
  const updateSearch = value => {
    const {
      search,
      ...queries
    } = query;
    if (value.trim()) {
      push({
        query: {
          ...queries,
          search: value
        }
      });
    } else {
      push({
        query: queries
      });
    }
  };
  const selectedFields = useSelectedFields(list, listViewFieldModesByField);
  const {
    data: newData,
    error: newError,
    refetch
  } = client.useQuery(React.useMemo(() => {
    const selectedGqlFields = [...selectedFields].map(fieldPath => list.fields[fieldPath].controller.graphqlSelection).join('\n');

    // TODO: FIXME: this is bad
    return client.gql`
        query (
          $where: ${list.gqlNames.whereInputName},
          $take: Int!,
          $skip: Int!,
          $orderBy: [${list.gqlNames.listOrderName}!]
        ) {
          items: ${list.gqlNames.listQueryName}(
            where: $where,
            take: $take,
            skip: $skip,
            orderBy: $orderBy
          ) {
            ${
    // TODO: maybe namespace all the fields instead of doing this
    selectedFields.has('id') ? '' : 'id'}
            ${selectedGqlFields}
          }
          count: ${list.gqlNames.listQueryCountName}(where: $where)
        }
      `;
  }, [list, selectedFields]), {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    skip: !metaQuery.data,
    variables: {
      where: {
        ...filters.where,
        ...search
      },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      orderBy: sort ? [{
        [sort.field]: sort.direction.toLowerCase()
      }] : undefined
    }
  });
  const [dataState, setDataState] = React.useState({
    data: newData,
    error: newError
  });
  if (newData && dataState.data !== newData) {
    setDataState({
      data: newData,
      error: newError
    });
  }
  const {
    data,
    error
  } = dataState;
  const dataGetter$1 = dataGetter.makeDataGetter(data, error === null || error === void 0 ? void 0 : error.graphQLErrors);
  const [selectedItemsState, setSelectedItems] = React.useState(() => ({
    itemsFromServer: undefined,
    selectedItems: new Set()
  }));

  // this removes the selected items which no longer exist when the data changes
  // because someone goes to another page, changes filters or etc.
  if (data && data.items && selectedItemsState.itemsFromServer !== data.items) {
    const newSelectedItems = new Set();
    data.items.forEach(item => {
      if (selectedItemsState.selectedItems.has(item.id)) {
        newSelectedItems.add(item.id);
      }
    });
    setSelectedItems({
      itemsFromServer: data.items,
      selectedItems: newSelectedItems
    });
  }
  const theme = core.useTheme();
  const showCreate = !((_metaQuery$data$keyst = (_metaQuery$data3 = metaQuery.data) === null || _metaQuery$data3 === void 0 || (_metaQuery$data3 = _metaQuery$data3.keystone.adminMeta.list) === null || _metaQuery$data3 === void 0 ? void 0 : _metaQuery$data3.hideCreate) !== null && _metaQuery$data$keyst !== void 0 ? _metaQuery$data$keyst : true) || null;
  return core.jsx(PageContainer.PageContainer, {
    header: core.jsx(ListPageHeader, {
      listKey: listKey
    }),
    title: list.label
  }, error !== null && error !== void 0 && error.graphQLErrors.length || error !== null && error !== void 0 && error.networkError ? core.jsx(GraphQLErrorNotice.GraphQLErrorNotice, {
    errors: error === null || error === void 0 ? void 0 : error.graphQLErrors,
    networkError: error === null || error === void 0 ? void 0 : error.networkError
  }) : null, metaQuery.error ? 'Error...' : null, data && metaQuery.data ? core.jsx(React.Fragment, null, list.description !== null && core.jsx("p", {
    css: {
      marginTop: '24px',
      maxWidth: '704px'
    }
  }, list.description), core.jsx(core.Stack, {
    across: true,
    gap: "medium",
    align: "center",
    marginTop: "xlarge"
  }, core.jsx("form", {
    onSubmit: e => {
      e.preventDefault();
      updateSearch(searchString);
    }
  }, core.jsx(core.Stack, {
    across: true
  }, core.jsx(fields.TextInput, {
    css: {
      borderRadius: '4px 0px 0px 4px'
    },
    autoFocus: true,
    value: searchString,
    onChange: e => updateSearchString(e.target.value),
    placeholder: `Search by ${searchLabels.length ? searchLabels.join(', ') : 'ID'}`
  }), core.jsx(button.Button, {
    css: {
      borderRadius: '0px 4px 4px 0px'
    },
    type: "submit"
  }, core.jsx(SearchIcon.SearchIcon, null)))), showCreate && core.jsx(CreateButtonLink.CreateButtonLink, {
    list: list
  }), data.count || filters.filters.length ? core.jsx(FilterAdd, {
    listKey: listKey,
    filterableFields: filterableFields
  }) : null, filters.filters.length ? core.jsx(FilterList, {
    filters: filters.filters,
    list: list
  }) : null, Boolean(filters.filters.length || query.sortBy !== undefined || query.fields || query.search) && core.jsx(button.Button, {
    size: "small",
    onClick: resetToDefaults
  }, "Reset to defaults")), data.count ? core.jsx(React.Fragment, null, core.jsx(ResultsSummaryContainer, null, (() => {
    const selectedItems = selectedItemsState.selectedItems;
    const selectedItemsCount = selectedItems.size;
    if (selectedItemsCount) {
      var _metaQuery$data$keyst2, _metaQuery$data4;
      return core.jsx(React.Fragment, null, core.jsx("span", {
        css: {
          marginRight: theme.spacing.small
        }
      }, "Selected ", selectedItemsCount, " of ", data.items.length), !((_metaQuery$data$keyst2 = (_metaQuery$data4 = metaQuery.data) === null || _metaQuery$data4 === void 0 || (_metaQuery$data4 = _metaQuery$data4.keystone.adminMeta.list) === null || _metaQuery$data4 === void 0 ? void 0 : _metaQuery$data4.hideDelete) !== null && _metaQuery$data$keyst2 !== void 0 ? _metaQuery$data$keyst2 : true) && core.jsx(DeleteManyButton, {
        list: list,
        selectedItems: selectedItems,
        refetch: refetch
      }));
    }
    return core.jsx(React.Fragment, null, core.jsx(Pagination.PaginationLabel, {
      currentPage: currentPage,
      pageSize: pageSize,
      plural: list.plural,
      singular: list.singular,
      total: data.count
    }), ", sorted by ", core.jsx(SortSelection, {
      list: list,
      orderableFields: orderableFields
    }), "with", ' ', core.jsx(FieldSelection, {
      list: list,
      fieldModesByFieldPath: listViewFieldModesByField
    }), ' ');
  })()), core.jsx(ListTable, {
    count: data.count,
    currentPage: currentPage,
    itemsGetter: dataGetter$1.get('items'),
    listKey: listKey,
    pageSize: pageSize,
    selectedFields: selectedFields,
    sort: sort,
    selectedItems: selectedItemsState.selectedItems,
    onSelectedItemsChange: selectedItems => {
      setSelectedItems({
        itemsFromServer: selectedItemsState.itemsFromServer,
        selectedItems
      });
    },
    orderableFields: orderableFields
  })) : core.jsx(ResultsSummaryContainer, null, "No ", list.plural, " found.")) : core.jsx(core.Center, {
    css: {
      height: `calc(100vh - ${PageContainer.HEADER_HEIGHT}px)`
    }
  }, core.jsx(loading.LoadingDots, {
    label: "Loading item data",
    size: "large",
    tone: "passive"
  })));
}
function ListPageHeader({
  listKey
}) {
  const list = adminUi_context_dist_keystone6CoreAdminUiContext.useList(listKey);
  return core.jsx(React.Fragment, null, core.jsx("div", {
    css: {
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between'
    }
  }, core.jsx(core.Heading, {
    type: "h3"
  }, list.label)));
}
function ResultsSummaryContainer({
  children
}) {
  return core.jsx("p", {
    css: {
      // TODO: don't do this
      // (this is to make it so things don't move when a user selects an item)
      minHeight: 38,
      display: 'flex',
      alignItems: 'center'
    }
  }, children);
}
function SortDirectionArrow({
  direction
}) {
  const size = '0.25em';
  return core.jsx("span", {
    css: {
      borderLeft: `${size} solid transparent`,
      borderRight: `${size} solid transparent`,
      borderTop: `${size} solid`,
      display: 'inline-block',
      height: 0,
      marginLeft: '0.33em',
      marginTop: '-0.125em',
      verticalAlign: 'middle',
      width: 0,
      transform: `rotate(${direction === 'DESC' ? '0deg' : '180deg'})`
    }
  });
}
function DeleteManyButton({
  selectedItems,
  list,
  refetch
}) {
  const [deleteItems, deleteItemsState] = client.useMutation(React.useMemo(() => client.gql`
        mutation($where: [${list.gqlNames.whereUniqueInputName}!]!) {
          ${list.gqlNames.deleteManyMutationName}(where: $where) {
            id
            ${list.labelField}
          }
        }
`, [list]), {
    errorPolicy: 'all'
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const toasts = toast.useToasts();
  return core.jsx(React.Fragment, null, core.jsx(button.Button, {
    isLoading: deleteItemsState.loading,
    tone: "negative",
    onClick: async () => {
      setIsOpen(true);
    }
  }, "Delete"), core.jsx(modals.AlertDialog
  // TODO: change the copy in the title and body of the modal
  , {
    isOpen: isOpen,
    title: "Delete Confirmation",
    tone: "negative",
    actions: {
      confirm: {
        label: 'Delete',
        action: async () => {
          const {
            data,
            errors
          } = await deleteItems({
            variables: {
              where: [...selectedItems].map(id => ({
                id
              }))
            }
          });
          /*
            Data returns an array where successful deletions are item objects
            and unsuccessful deletions are null values.
            Run a reduce to count success and failure as well as
            to generate the success message to be passed to the success toast
           */
          const {
            successfulItems,
            unsuccessfulItems,
            successMessage
          } = data[list.gqlNames.deleteManyMutationName].reduce((acc, curr) => {
            if (curr) {
              acc.successfulItems++;
              acc.successMessage = acc.successMessage === '' ? acc.successMessage += curr[list.labelField] : acc.successMessage += `, ${curr[list.labelField]}`;
            } else {
              acc.unsuccessfulItems++;
            }
            return acc;
          }, {
            successfulItems: 0,
            unsuccessfulItems: 0,
            successMessage: ''
          });

          // If there are errors
          if (errors !== null && errors !== void 0 && errors.length) {
            // Find out how many items failed to delete.
            // Reduce error messages down to unique instances, and append to the toast as a message.
            toasts.addToast({
              tone: 'negative',
              title: `Failed to delete ${unsuccessfulItems} of ${data[list.gqlNames.deleteManyMutationName].length} ${list.plural}`,
              message: errors.reduce((acc, error) => {
                if (acc.indexOf(error.message) < 0) {
                  acc.push(error.message);
                }
                return acc;
              }, []).join('\n')
            });
          }
          if (successfulItems) {
            toasts.addToast({
              tone: 'positive',
              title: `Deleted ${successfulItems} of ${data[list.gqlNames.deleteManyMutationName].length} ${list.plural} successfully`,
              message: successMessage
            });
          }
          return refetch();
        }
      },
      cancel: {
        label: 'Cancel',
        action: () => {
          setIsOpen(false);
        }
      }
    }
  }, "Are you sure you want to delete ", selectedItems.size, ' ', selectedItems.size === 1 ? list.singular : list.plural, "?"));
}
function ListTable({
  selectedFields,
  listKey,
  itemsGetter,
  count,
  sort,
  currentPage,
  pageSize,
  selectedItems,
  onSelectedItemsChange,
  orderableFields
}) {
  var _itemsGetter$data, _itemsGetter$data4;
  const list = adminUi_context_dist_keystone6CoreAdminUiContext.useList(listKey);
  const {
    query
  } = router.useRouter();
  const shouldShowLinkIcon = selectedFields.keys().some((k, i) => !list.fields[k].views.Cell.supportsLinkTo && i === 0);
  return core.jsx(core.Box, {
    paddingBottom: "xlarge"
  }, core.jsx(TableContainer, null, core.jsx(core.VisuallyHidden, {
    as: "caption"
  }, list.label, " list"), core.jsx("colgroup", null, core.jsx("col", {
    width: "30"
  }), shouldShowLinkIcon && core.jsx("col", {
    width: "30"
  }), [...selectedFields].map(path => core.jsx("col", {
    key: path
  }))), core.jsx(TableHeaderRow, null, core.jsx(TableHeaderCell, {
    css: {
      paddingLeft: 0
    }
  }, core.jsx("label", {
    css: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'start',
      cursor: 'pointer'
    }
  }, core.jsx(fields.CheckboxControl, {
    size: "small",
    checked: selectedItems.size === ((_itemsGetter$data = itemsGetter.data) === null || _itemsGetter$data === void 0 ? void 0 : _itemsGetter$data.length),
    css: {
      cursor: 'default'
    },
    onChange: () => {
      var _itemsGetter$data2;
      const newSelectedItems = new Set();
      if (selectedItems.size !== ((_itemsGetter$data2 = itemsGetter.data) === null || _itemsGetter$data2 === void 0 ? void 0 : _itemsGetter$data2.length)) {
        var _itemsGetter$data3;
        (_itemsGetter$data3 = itemsGetter.data) === null || _itemsGetter$data3 === void 0 || _itemsGetter$data3.forEach(item => {
          if (item !== null && item.id !== null) {
            newSelectedItems.add(item.id);
          }
        });
      }
      onSelectedItemsChange(newSelectedItems);
    }
  }))), shouldShowLinkIcon && core.jsx(TableHeaderCell, null), [...selectedFields].map(path => {
    const label = list.fields[path].label;
    if (!orderableFields.has(path)) return core.jsx(TableHeaderCell, {
      key: path
    }, label);
    return core.jsx(TableHeaderCell, {
      key: path
    }, core.jsx(adminUi_router_dist_keystone6CoreAdminUiRouter.Link, {
      css: {
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        ':hover': {
          color: 'inherit'
        }
      },
      href: {
        query: {
          ...query,
          sortBy: (sort === null || sort === void 0 ? void 0 : sort.field) === path && sort.direction === 'ASC' ? `-${path}` : path
        }
      }
    }, label, (sort === null || sort === void 0 ? void 0 : sort.field) === path && core.jsx(SortDirectionArrow, {
      direction: sort.direction
    })));
  })), core.jsx("tbody", null, ((_itemsGetter$data4 = itemsGetter.data) !== null && _itemsGetter$data4 !== void 0 ? _itemsGetter$data4 : []).map((_, index) => {
    const itemGetter = itemsGetter.get(index);
    if (itemGetter.data === null || itemGetter.data.id === null) {
      if (itemGetter.errors) {
        return core.jsx("tr", {
          css: {
            color: 'red'
          },
          key: `index:${index}`
        }, itemGetter.errors[0].message);
      }
      return null;
    }
    const itemId = itemGetter.data.id;
    return core.jsx("tr", {
      key: itemId || `index:${index}`
    }, core.jsx(TableBodyCell, null, core.jsx("label", {
      css: {
        display: 'flex',
        minHeight: 38,
        alignItems: 'center',
        justifyContent: 'start'
      }
    }, core.jsx(fields.CheckboxControl, {
      size: "small",
      checked: selectedItems.has(itemId),
      css: {
        cursor: 'default'
      },
      onChange: () => {
        const newSelectedItems = new Set(selectedItems);
        if (selectedItems.has(itemId)) {
          newSelectedItems.delete(itemId);
        } else {
          newSelectedItems.add(itemId);
        }
        onSelectedItemsChange(newSelectedItems);
      }
    }))), shouldShowLinkIcon && core.jsx(TableBodyCell, null, core.jsx(adminUi_router_dist_keystone6CoreAdminUiRouter.Link, {
      css: {
        textDecoration: 'none',
        minHeight: 38,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      href: `/${list.path}/[id]`,
      as: `/${list.path}/${encodeURIComponent(itemId)}`
    }, core.jsx(ArrowRightCircleIcon.ArrowRightCircleIcon, {
      size: "smallish",
      "aria-label": "Go to item"
    }))), [...selectedFields].map((path, i) => {
      const field = list.fields[path];
      const {
        Cell
      } = list.fields[path].views;
      const itemForField = {};
      for (const graphqlField of getRootGraphQLFieldsFromFieldController.getRootGraphQLFieldsFromFieldController(field.controller)) {
        const fieldGetter = itemGetter.get(graphqlField);
        if (fieldGetter.errors) {
          const errorMessage = fieldGetter.errors[0].message;
          return core.jsx(TableBodyCell, {
            css: {
              color: 'red'
            },
            key: path
          }, i === 0 && Cell.supportsLinkTo ? core.jsx(CellLink.CellLink, {
            href: `/${list.path}/[id]`,
            as: `/${list.path}/${encodeURIComponent(itemId)}`
          }, errorMessage) : errorMessage);
        }
        itemForField[graphqlField] = fieldGetter.data;
      }
      return core.jsx(TableBodyCell, {
        key: path
      }, core.jsx(Cell, {
        field: field.controller,
        item: itemForField,
        linkTo: i === 0 && Cell.supportsLinkTo ? {
          href: `/${list.path}/[id]`,
          as: `/${list.path}/${encodeURIComponent(itemId)}`
        } : undefined
      }));
    }));
  }))), core.jsx(Pagination.Pagination, {
    singular: list.singular,
    plural: list.plural,
    total: count,
    currentPage: currentPage,
    pageSize: pageSize
  }));
}
function TableContainer({
  children
}) {
  return core.jsx("table", {
    css: {
      minWidth: '100%',
      tableLayout: 'fixed',
      'tr:last-child td': {
        borderBottomWidth: 0
      }
    },
    cellPadding: "0",
    cellSpacing: "0"
  }, children);
}
function TableHeaderRow({
  children
}) {
  return core.jsx("thead", null, core.jsx("tr", null, children));
}
function TableHeaderCell(props) {
  const {
    colors,
    spacing,
    typography
  } = core.useTheme();
  return core.jsx("th", _extends({
    css: {
      backgroundColor: colors.background,
      borderBottom: `2px solid ${colors.border}`,
      color: colors.foregroundDim,
      fontSize: typography.fontSize.medium,
      fontWeight: typography.fontWeight.medium,
      padding: spacing.small,
      textAlign: 'left',
      position: 'sticky',
      top: 0
    }
  }, props));
}
function TableBodyCell(props) {
  const {
    colors,
    typography
  } = core.useTheme();
  return core.jsx("td", _extends({
    css: {
      borderBottom: `1px solid ${colors.border}`,
      fontSize: typography.fontSize.medium
    }
  }, props));
}

exports.getListPage = getListPage;
