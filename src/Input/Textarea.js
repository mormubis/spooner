import React from 'react';

import { useField } from '../Field';

const Textarea = props => {
  const {
    error,
    onBlur = () => {},
    onChange = () => {},
    onFocus = () => {},
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
    <textarea
      {...fieldProps}
      data-error={!!error}
      data-value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      onInvalid={undefined}
      value={value}
    />
  );
};

export default Textarea;
