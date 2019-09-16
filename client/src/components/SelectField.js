import React from 'react';
import Select from "react-select";

const SelectField = ({ options, field, form, isMulti, placeholder }) => {

  const getValue = () => {
    if (options && field.value) {
      return isMulti
        ? options.filter(option => field.value.indexOf(option.value) >= 0)
        : options.find(option => option.value === field.value);
    } else {
      return isMulti ? [] : "";
    }
  };

  const onChange = (option) => {
    form.setFieldValue(
      field.name,
      isMulti
        ? option && option.map((item) => item.value)
        : option && option.value
    );
  };

  return (
    <Select
      isMulti={isMulti}
      options={options}
      name={field.name}
      value={getValue()}
      onChange={onChange}
      onBlur={field.onBlur}
      placeholder={placeholder}
    />
  );
}

export default SelectField;
