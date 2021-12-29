import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { useField } from '../Field';

const Radio = forwardRef(({ content, ...input }, ref: React.Ref<HTMLInputElement>) => {
  const {
    error,
    onBlur = () => {},
    onChange = () => {},
    onFocus = () => {},
    value,
    ...props
  } = useField(input);

  const handleBlur = () => {
    onBlur();
  };

  const handleChange = (event) => {
    const { checked } = event.target;

    event.stopPropagation();

    onChange(checked ? content : value);
  };

  const handleFocus = () => {
    onFocus();
  };

  return (
    <input
      {...props}
      checked={content === value}
      data-checked={content === value}
      data-error={!!error}
      data-value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      ref={ref}
      type="radio"
    />
  );
});

Radio.propTypes = {
  content: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

export default Radio;
