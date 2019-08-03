import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { useField } from '../Field';

const File = ({ forwardedRef, ...props }) => {
  const {
    error,
    multiple = false,
    onBlur = () => {},
    onChange = () => {},
    onFocus = () => {},
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
      data-error={!!error}
      data-multiple={multiple}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      ref={forwardedRef}
      type="file"
    />
  );
};

File.propTypes = {
  error: PropTypes.string,
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.element) }),
  ]),
  multiple: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  type: PropTypes.string,
};

export default forwardRef((props, ref) => (
  <File {...props} forwardedRef={ref} />
));
