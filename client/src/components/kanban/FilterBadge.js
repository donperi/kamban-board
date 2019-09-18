import React from 'react';
import {withRouter} from "react-router-dom";

const FilterBadge = ({ field, value, label = null, allowEmptySearch, location, history, emptyMessage = 'N/A', variant='secondary', classNames }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!allowEmptySearch && !value) {
      return;
    }

    history.push({
      pathname: location.pathname,
      search: `?${field}=${value || null}`
    })
  };

  return (
    <span
      onClick={handleClick}
      className={`FilterBadge badge badge-${variant} ${classNames}`}
    >
      {label || value || (<i>{emptyMessage}</i>)}
    </span>
  );
};

export default withRouter(FilterBadge);
