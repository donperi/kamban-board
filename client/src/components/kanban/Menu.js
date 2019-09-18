import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import {NavLink, withRouter} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import BulkEditMenu from "./BulkEditMenu";
import Badge from "react-bootstrap/Badge";
import FilterForm from "./FIlterForm";
import SettingsForm from "./SettingsForm";

const Menu = ({ isFiltering, filteredTasks, selectedTasks, history, settings }) => {
  let filterBadge = null;
  if (filteredTasks) {
    filterBadge = (<Badge variant={'info'} className='mr-2'>ON</Badge>)
  }

  const handleClear = () => {
    history.push({
      pathname: history.location.pathname,
      search: ''
    });
  }

  return (
    <Navbar bg="light" expand="lg" className="mb-3 d-block d-md-flex">
      <Navbar.Brand className="w-25">Kanban-Board</Navbar.Brand>

      <div className="ml-auto d-flex flex-column flex-sm-row flex-grow-1">
        <ButtonToolbar className="ml-auto">
          {isFiltering && <div className={'p-2'}>Filtering...</div>}
          <Dropdown key={history.location.search} className="mr-2">
            <Dropdown.Toggle variant="outline-success" id="filter-menu">
              {filterBadge}
              Filter
            </Dropdown.Toggle>
            <Dropdown.Menu
              alignRight
              as={FilterForm}
              selectedTasks={selectedTasks}
              onClear={handleClear}
              history={history}
            />
          </Dropdown>

          {filteredTasks
          && (
            <Button variant="danger" className="mr-2" onClick={handleClear}>
              Clear Filter
            </Button>
          )}

          <NavLink to="/task/add" className="mr-2 btn btn-outline-primary">
            <FontAwesomeIcon icon="plus" className="mr-1" />
            Add Task
          </NavLink>

          {(selectedTasks.length > 0) && (
            <Dropdown className="mr-2">
              <Dropdown.Toggle variant="outline-info" id="bulk-edit-menu">
                <Badge pill variant="info" className="mr-2">{selectedTasks.length}</Badge>
                Quick Edit
              </Dropdown.Toggle>
              <Dropdown.Menu alignRight as={BulkEditMenu} selectedTasks={selectedTasks} />
            </Dropdown>
          )}
          <Dropdown key={JSON.stringify(settings)} className="mr-2">
            <Dropdown.Toggle variant="outline-secondary" id="settings-menu">
              <FontAwesomeIcon icon="cog" className="mr-1" />
              Settings
            </Dropdown.Toggle>
            <Dropdown.Menu
              alignRight
              as={SettingsForm}
              selectedTasks={selectedTasks}
              onClear={handleClear}
              history={history}
            />
          </Dropdown>
        </ButtonToolbar>
      </div>
    </Navbar>
  )
};

export default withRouter(Menu);
