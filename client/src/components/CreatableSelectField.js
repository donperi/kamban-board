import React, { useState } from "react";
import toastr from "toastr";
import CreatableSelect from "react-select/creatable";

const CreatableSelectField = ({
  options,
  onCreateOption,
  field,
  form,
  isMulti,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const getValue = () => {
    if (options && field.value) {
      return isMulti
        ? options.filter((option) => field.value.indexOf(option.value) >= 0)
        : options.find((option) => option.value === field.value);
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
    <CreatableSelect
      isMulti={isMulti}
      options={options}
      name={field.name}
      value={getValue()}
      onChange={onChange}
      onBlur={field.onBlur}
      onCreateOption={async (input) => {
        setLoading(true);
        try {
          const value = await onCreateOption(input);
          setLoading(false);
          onChange({ value });
        } catch (e) {
          toastr.error(e.message);
          setLoading(false);
        }
      }}
      isLoading={loading}
      isDisabled={loading}
      {...props}
    />
  );
};

export default CreatableSelectField;
