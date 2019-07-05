import React from 'react';

import { useField } from '../Field';

const Input = props => {
  const {
    error,
    onBlur = () => {},
    onChange = () => {},
    onFocus = () => {},
    type = 'text',
    value = '',
    ...fieldProps
  } = useField(props);

  const handleBlur = () => {
    onBlur();
  };

  const handleChange = event => {
    const { value: rvalue } = event.target;

    event.stopPropagation();

    onChange(rvalue);
  };

  const handleFocus = () => {
    onFocus();
  };

  return (
    <input
      {...fieldProps}
      data-error={!!error}
      data-value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      onInvalid={undefined}
      type={type}
      value={value}
    />
  );
};

export default Input;
