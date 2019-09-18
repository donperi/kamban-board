import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {bulkEditTasks, createUser} from "../../services/kanban";
import {Field, Formik} from "formik";
import Form from "react-bootstrap/Form";
import CreatableSelectField from "../CreatableSelectField";
import SelectField from "../SelectField";
import BootstrapDatePicker from "../BoostrapDatePicker";
import toastr from 'toastr';

import './BulkEditMenu.scss';
import Button from "react-bootstrap/Button";

const BulkEditMenu = React.forwardRef(({ selectedTasks, styles, className }, ref) => {
  const tags = useSelector(state => state.kanban.tags);
  const users = useSelector(state => state.kanban.users);
  const dispatch = useDispatch();

  const tagsOptions = Object.values(tags).map((tag) => ({
    value: tag._id,
    label: tag.name
  }));


  const usersOptions = Object.values(users).map((user) => ({
    value: user._id,
    label: user.name
  }));

  const handleUserCreate = async (input) => {
    try {
      const user = await dispatch(createUser({ name: input }));
      return Promise.resolve(user._id);
    } catch (e) {
      return Promise.reject(new Error('An error occurred creating the user.'));
    }
  };

  const handleSubmit = async (values, actions) => {
    try {
      await dispatch(bulkEditTasks(selectedTasks, values ));
      actions.resetForm();
      toastr.success('Tasks have been updated.');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  return (
    <div ref={ref} style={styles} className={`BulkEditMenu p-4 ${className}`}>
      <Formik
        initialValues={{
          assignee: '',
          due_date: '',
          time_estimates: '',
          tags: [],
        }}
        onSubmit={handleSubmit}
        render={(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Form.Group>
              <Form.Label>Set Assignee:</Form.Label>
              <Field
                component={CreatableSelectField}
                name="assignee"
                placeholder="Select or create an assignee"
                onCreateOption={handleUserCreate}
                options={usersOptions}
                isClearable={true}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Set new Tags:</Form.Label>
              <Field
                component={SelectField}
                options={tagsOptions}
                name="tags"
                placeholder="Add Tags"
                isMulti={true}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Set Due Date:</Form.Label>
              <Field component={BootstrapDatePicker} className="form-control" name="due_date" placeholder="MM/DD/YYY" />
            </Form.Group>

            <Form.Group>
              <Form.Label>Time Estimates</Form.Label>
              <Field className="form-control" name="time_estimates" placeholder="Ex: 1h" />
            </Form.Group>

            <Form.Group className="text-right">
              <Button variant="info" className="mr-2" type="submit">Update Tasks</Button>
            </Form.Group>
          </Form>
        )}
      />
    </div>
  )
});

export default BulkEditMenu;
