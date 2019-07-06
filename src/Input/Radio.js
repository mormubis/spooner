import React from 'react';

import { useField } from '../Field';

const Radio = props => {
  const {
    content,
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

    onChange(checked ? content : value);
  };

  const handleFocus = () => {
    onFocus();
  };

  return (
    <input
      {...fieldProps}
      checked={content === value}
      data-error={!!error}
      data-value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      type="radio"
    />
  );
};

export default Radio;
