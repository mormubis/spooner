import React from 'react';

import { useField } from '../Field';

const Checkbox = props => {
  const {
    error,
    onBlur = () => {},
    onChange = () => {},
    onFocus = () => {},
    value,
    ...fieldProps
  } = useField(props);

  const handleBlur = () => {
    onBlur();
  };

  const handleChange = event => {
    const { checked } = event.target;

    event.stopPropagation();

    onChange(checked);
  };

  const handleFocus = () => {
    onFocus();
  };

  return (
    <input
      {...fieldProps}
      checked={value}
      data-error={error}
      data-value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      onInvalid={undefined}
      type="checkbox"
    />
  );
};

export default Checkbox;
