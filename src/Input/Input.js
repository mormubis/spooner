import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { useField } from '../Field';

const Input = ({ forwardedRef, ...input }) => {
  const {
    error,
    onBlur = () => {},
    onChange = () => {},
    onFocus = () => {},
    type = 'text',
    value = '',
    ...props
  } = useField(input);

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
      {...props}
      data-error={!!error}
      data-value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      ref={forwardedRef}
      type={type}
      value={value}
    />
  );
};

Input.propTypes = {
  error: PropTypes.string,
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.element) }),
  ]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
};

export default forwardRef((props, ref) => (
  <Input {...props} forwardedRef={ref} />
));
