import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../services/kanban";
import { Field, Formik } from "formik";
import Form from "react-bootstrap/Form";
import CreatableSelectField from "../CreatableSelectField";
import BootstrapDatePicker from "../BoostrapDatePicker";
import SelectField from "../SelectField";
import Button from "react-bootstrap/Button";

const TaskForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
}) => {
  const tags = useSelector((state) => state.kanban.tags);
  const users = useSelector((state) => state.kanban.users);
  const dispatch = useDispatch();

  const tagsOptions = Object.values(tags).map((tag) => ({
    value: tag._id,
    label: tag.name,
  }));

  const usersOptions = Object.values(users).map((user) => ({
    value: user._id,
    label: user.name,
  }));

  const handleUserCreate = async (input) => {
    try {
      const user = await dispatch(createUser({ name: input }));
      return Promise.resolve(user._id);
    } catch (e) {
      return Promise.reject(new Error("An error occurred creating the user."));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onSubmit(values, actions);
      }}
      render={(props) => (
        <Form onSubmit={props.handleSubmit}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Field
              required
              className="form-control"
              name="title"
              placeholder="Awesome Task"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Field
              component="textarea"
              className="form-control"
              name="description"
              placeholder="Task Description"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Assignee</Form.Label>
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
            <Form.Label>Time Estimates</Form.Label>
            <Field
              className="form-control"
              name="time_estimates"
              placeholder="Ex: 1h"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Due Date</Form.Label>
            <Field
              component={BootstrapDatePicker}
              className="form-control"
              name="due_date"
              placeholder="MM/DD/YYY"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Tags:</Form.Label>
            <Field
              component={SelectField}
              options={tagsOptions}
              name="tags"
              placeholder="Select Tags"
              isMulti={true}
            />
          </Form.Group>

          <Form.Group className="text-right">
            <Button variant="primary" className="mr-2" type="submit">
              {submitText}
            </Button>
            <Button variant="danger" onClick={onCancel}>
              {cancelText}
            </Button>
          </Form.Group>
        </Form>
      )}
    />
  );
};

export default TaskForm;
