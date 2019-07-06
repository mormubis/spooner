import React from 'react';

import { useField } from '../Field';

const File = props => {
  const {
    error,
    multiple = false,
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
    const { files } = event.target;

    event.stopPropagation();

    onChange(multiple ? files : files[0]);
  };

  const handleFocus = () => {
    onFocus();
  };

  return (
    <input
      {...fieldProps}
      checked={value}
      data-error={!!error}
      data-value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      type="file"
    />
  );
};

export default File;
