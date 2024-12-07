import { useEffect } from 'react';
import { useTheme, jsx, Stack } from '@keystone-ui/core';
import { Select } from '@keystone-ui/fields';
import { ChevronLeftIcon, ChevronRightIcon } from '@keystone-ui/icons';
import { Link } from '../admin-ui/router/dist/keystone-6-core-admin-ui-router.esm.js';
import { useRouter } from 'next/router';

/** @jsxRuntime classic */
function usePaginationParams({
  defaultPageSize
}) {
  const {
    query
  } = useRouter();
  const currentPage = Math.max(typeof query.page === 'string' && !Number.isNaN(parseInt(query.page)) ? Number(query.page) : 1, 1);
  const pageSize = typeof query.pageSize === 'string' && !Number.isNaN(parseInt(query.pageSize)) ? parseInt(query.pageSize) : defaultPageSize;
  return {
    currentPage,
    pageSize
  };
}
function getPaginationStats({
  singular,
  plural,
  pageSize,
  currentPage,
  total
}) {
  let stats = '';
  if (total > pageSize) {
    const start = pageSize * (currentPage - 1) + 1;
    const end = Math.min(start + pageSize - 1, total);
    stats = `${start} - ${end} of ${total} ${plural}`;
  } else {
    if (total > 1 && plural) {
      stats = `${total} ${plural}`;
    } else if (total === 1 && singular) {
      stats = `${total} ${singular}`;
    }
  }
  return {
    stats
  };
}
function Pagination({
  currentPage,
  total,
  pageSize,
  singular,
  plural
}) {
  const {
    query,
    pathname,
    push
  } = useRouter();
  const {
    stats
  } = getPaginationStats({
    singular,
    plural,
    currentPage,
    total,
    pageSize
  });
  const {
    opacity
  } = useTheme();
  const nextPage = currentPage + 1;
  const prevPage = currentPage - 1;
  const minPage = 1;
  const nxtQuery = {
    ...query,
    page: nextPage
  };
  const prevQuery = {
    ...query,
    page: prevPage
  };
  const limit = Math.ceil(total / pageSize);
  const pages = [];
  useEffect(() => {
    // Check if the current page is larger than
    // the maximal page given the total and associated page size value.
    // (This could happen due to a deletion event, in which case we want to reroute the user to a previous page).
    if (currentPage > Math.ceil(total / pageSize)) {
      push({
        pathname,
        query: {
          ...query,
          page: Math.ceil(total / pageSize)
        }
      });
    }
  }, [total, pageSize, currentPage, pathname, query, push]);

  // Don't render the pagination component if the pageSize is greater than the total number of items in the list.
  if (total <= pageSize) return null;
  const onChange = selectedOption => {
    push({
      pathname,
      query: {
        ...query,
        page: selectedOption.value
      }
    });
  };
  for (let page = minPage; page <= limit; page++) {
    pages.push({
      label: String(page),
      value: String(page)
    });
  }
  return jsx(Stack, {
    as: "nav",
    role: "navigation",
    "aria-label": "Pagination",
    paddingLeft: "medium",
    paddingRight: "medium",
    paddingTop: "large",
    paddingBottom: "large",
    across: true,
    align: "center",
    css: {
      width: '100%',
      justifyContent: 'space-between'
    }
  }, jsx(Stack, {
    across: true,
    gap: "xxlarge",
    align: "center"
  }, jsx("span", null, `${plural} per page: ${pageSize}`), jsx("span", null, jsx("strong", null, stats))), jsx(Stack, {
    gap: "medium",
    across: true,
    align: "center"
  }, jsx(Select, {
    width: "medium",
    value: {
      label: String(currentPage),
      value: String(currentPage)
    },
    options: pages,
    styles: {
      valueContainer: provided => ({
        ...provided,
        paddingLeft: '12px',
        paddingRight: '16px'
      })
    },
    menuPortalTarget: document.body,
    onChange: onChange
  }), jsx("span", null, "of ", limit), jsx(Link, {
    "aria-label": "Previous page",
    css: {
      color: '#415269',
      ...(prevPage < minPage && {
        pointerEvents: 'none',
        opacity: opacity.disabled
      })
    },
    href: {
      query: prevQuery
    }
  }, jsx(ChevronLeftIcon, null)), jsx(Link, {
    "aria-label": "Next page",
    css: {
      color: '#415269',
      ...(nextPage > limit && {
        pointerEvents: 'none',
        opacity: opacity.disabled
      })
    },
    href: {
      query: nxtQuery
    }
  }, jsx(ChevronRightIcon, null))));
}
function PaginationLabel({
  currentPage,
  pageSize,
  plural,
  singular,
  total
}) {
  const {
    stats
  } = getPaginationStats({
    plural,
    singular,
    currentPage,
    total,
    pageSize
  });
  if (!total) {
    return jsx("span", null, "No ", plural);
  }
  return jsx("span", null, "Showing ", jsx("strong", null, stats));
}

export { Pagination as P, PaginationLabel as a, usePaginationParams as u };
