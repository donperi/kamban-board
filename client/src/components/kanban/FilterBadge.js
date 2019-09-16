import React from 'react';
import Badge from "react-bootstrap/Badge";

const FilterBadge = ({ field, value, emptyMessage = 'N/A', variant='secondary', classNames }) => {
  return (
    <a
      onClick={(e) => e.preventDefault() }
      href="#"
      className={`FilterBadge badge badge-${variant} ${classNames}`}
    >
      {value || (<i>{emptyMessage}</i>)}
    </a>
  )
}

export default FilterBadge;
