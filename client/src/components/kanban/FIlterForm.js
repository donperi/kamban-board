import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import qs from 'qs';
import {useSelector} from "react-redux";

import {Field, Formik} from "formik";
import SelectField from "../SelectField";
import BootstrapDatePicker from "../BoostrapDatePicker";
import moment from "moment";

const FilterForm = React.forwardRef(({ styles, className, history, onClear }, ref) => {
  const tags = useSelector(state => state.kanban.tags);
  const users = useSelector(state => state.kanban.users);

  const tagsOptions = Object.values(tags).map((tag) => ({
    value: tag._id,
    label: tag.name
  }));

  const usersOptions = Object.values(users).map((user) => ({
    value: user._id,
    label: user.name
  }));

  const query = qs.parse(history.location.search, { ignoreQueryPrefix: true });

  const handleSubmit = (values) => {
    Object.keys(values).forEach((key) => !values[key] && delete values[key]);

    if (values.due_date) {
      values.due_date = moment(values.due_date).format('YYYY-MM-DD');
    }

    history.push({
      pathname: history.location.pathname,
      search: qs.stringify(values, { addQueryPrefix: true })
    });
  };

  const initialDueDate = query.due_date !== 'null' ? query.due_date : null;

  return (
    <div ref={ref} style={styles} className={`BulkEditMenu p-4 ${className}`}>
      <Formik
        initialValues={{
          title: query.title || '',
          tag: query.tag || '',
          due_date: initialDueDate || '',
          assignee: query.assignee || ''
        }}
        onSubmit={handleSubmit}
        render={(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Form.Group>
              <Form.Label>Title:</Form.Label>
              <Field className="form-control" name="title" placeholder="Task Title" />
            </Form.Group>

            <Form.Group>
              <Form.Label>Assignee:</Form.Label>
              <Field
                component={SelectField}
                options={usersOptions}
                isClearable={true}
                name="assignee"
                placeholder="Select a assignee..."
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tag:</Form.Label>
              <Field
                component={SelectField}
                isClearable={true}
                options={tagsOptions}
                name="tags"
                placeholder="Select a tag..."
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Due Date:</Form.Label>
              <Field
                component={BootstrapDatePicker}
                className="form-control"
                name="due_date"
                placeholder="MM/DD/YYY"
                isClearable={props.values['due_date']}
              />
            </Form.Group>

            <Form.Group className="text-right">
              <Button
                variant="success"
                className="mr-2"
                type="submit"
                disabled={!props.dirty}
              >
                Submit
              </Button>
              <Button variant="danger" className="mr-2" onClick={onClear}>Clear</Button>
            </Form.Group>
          </Form>
        )}
      >
      </Formik>
    </div>
  )
});

export default FilterForm;
