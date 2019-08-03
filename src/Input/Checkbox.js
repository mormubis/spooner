import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { useField } from '../Field';

const Checkbox = ({ forwardedRef, ...props }) => {
  const {
    error,
    onBlur = () => {},
    onChange = () => {},
    onFocus = () => {},
    value = false,
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
      data-error={!!error}
      data-value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      ref={forwardedRef}
      type="checkbox"
    />
  );
};

Checkbox.propTypes = {
  error: PropTypes.string,
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.element) }),
  ]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.bool,
};

export default forwardRef((props, ref) => (
  <Checkbox {...props} forwardedRef={ref} />
));
