import React, { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";

import "./BootstrapDatePicker.scss";

const BootstrapDatePicker = ({ field, form, ...props }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.input.placeholder = props.placeholder;
  }, [props.placeholder]);

  return (
    <div className="BootstrapDatePicker">
      <DatePicker
        // dateFormat='DD-MM-YYYY'
        ref={inputRef}
        selected={field.value ? new Date(field.value) : ""}
        onChange={(date) => {
          form.setFieldValue(field.name, date);
        }}
        {...props}
      />
    </div>
  );
};

export default BootstrapDatePicker;
