import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { Field, Formik } from "formik";
import toastr from "toastr";

import SelectField from "../SelectField";
import { updateSettings } from "../../services/kanban";

const SettingsForm = React.forwardRef(
  ({ styles, className, history, onClear }, ref) => {
    const stages = useSelector((state) => state.kanban.stages);
    const settings = useSelector((state) => state.kanban.settings);
    const dispatch = useDispatch();

    const stagesOptions = Object.values(stages).map((stage) => ({
      value: stage._id,
      label: stage.name,
    }));

    const visibleStages = Object.values(stages).reduce((carry, stage) => {
      if (
        settings.visible_stages[stage._id] === undefined ||
        settings.visible_stages[stage._id]
      ) {
        carry.push(stage._id);
        return carry;
      }

      return carry;
    }, []);

    const handleSubmit = async (values) => {
      const newVisibleStages = Object.values(stages).reduce((carry, stage) => {
        carry[stage._id] = true;

        if (values.visible_stages.indexOf(stage._id) === -1) {
          carry[stage._id] = false;
        }

        return carry;
      }, {});

      await dispatch(
        updateSettings({
          visible_stages: newVisibleStages,
        })
      );

      toastr.success("Settings updated.");
    };

    return (
      <div ref={ref} style={styles} className={`BulkEditMenu p-4 ${className}`}>
        <h4>Settings</h4>
        <Formik
          initialValues={{
            visible_stages: visibleStages,
          }}
          onSubmit={handleSubmit}
          render={(props) => (
            <Form onSubmit={props.handleSubmit}>
              <Form.Group>
                <Form.Label>Visible Stages:</Form.Label>
                <Field
                  component={SelectField}
                  options={stagesOptions}
                  isClearable
                  isMulti
                  name="visible_stages"
                  placeholder="Select stages..."
                />
              </Form.Group>

              <Form.Group className="text-right">
                <Button
                  variant="success"
                  className="mr-2"
                  type="submit"
                  disabled={!props.dirty}
                >
                  Save
                </Button>
              </Form.Group>
            </Form>
          )}
        ></Formik>
      </div>
    );
  }
);

export default SettingsForm;
