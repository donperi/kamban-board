import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import BulkEditMenu from "./BulkEditMenu";
import Badge from "react-bootstrap/Badge";

const Menu = ({ selectedTasks }) => {
  return (
    <Navbar bg="light" expand="lg" className="mb-3 d-block d-md-flex">
      <Navbar.Brand href="#home" className="w-25">Kanban-Board</Navbar.Brand>

      <div className="ml-auto d-flex flex-column flex-sm-row flex-grow-1">
        <Form className="mr-sm-2 d-flex mb-2 mb-sm-0 flex-grow-1">
          <FormControl type="text" placeholder="Search" className="mr-2 flex-grow-1" />
          <Button variant="outline-success" className="flex-grow-0">Filter</Button>
        </Form>
        <ButtonToolbar className="ml-auto">
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
          <Button variant="outline-secondary">
            <FontAwesomeIcon icon="cog" className="mr-1" />
            Settings
          </Button>
        </ButtonToolbar>
      </div>
    </Navbar>
  )
};

export default Menu;
