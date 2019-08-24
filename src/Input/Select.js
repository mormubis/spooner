import React, { createRef, forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useField } from '../Field';

const Select = ({ children, forwardedRef = createRef(), ...input }) => {
  const {
    error,
    multiple = false,
    onBlur = () => {},
    onChange = () => {},
    onFocus = () => {},
    value,
    ...props
  } = useField(input);

  const element = useRef(null);

  const getOption = needle => {
    const options = Array.from(element.current.options);

    return (
      options.find(({ value: option }) => option === needle) ||
      (multiple ? undefined : options[0])
    );
  };

  const getValue = raw => {
    const options = Array.from(element.current.options);
    const rvalue = Array.isArray(raw) ? raw : [raw];

    let selected = rvalue
      .map(item => getOption(item))
      .filter(Boolean)
      .map(option => option.value);

    if (selected.length === 0 && !multiple) {
      const initial = options[0] || {};

      selected = [initial.value];
    }

    return multiple ? selected : selected[0];
  };

  const handleBlur = () => {
    onBlur();
  };

  const handleChange = event => {
    const { selectedOptions } = event.target;

    event.stopPropagation();

    const raw = Array.from(selectedOptions).map(option => option.value);
    const after = getValue(raw);

    onChange(after);
  };

  const handleFocus = () => {
    onFocus();
  };

  useEffect(() => {
    if (value === undefined) {
      const after = getValue(value);

      onChange(after);
    }
  }, []);

  return (
    <select
      {...props}
      data-error={!!error}
      data-multiple={multiple}
      data-value={value}
      multiple={multiple}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      ref={node => {
        element.current = node;
        // eslint-disable-next-line no-param-reassign
        forwardedRef.current = node;
      }}
      value={value}
    >
      {children}
    </select>
  );
};

Select.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
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
  <Select {...props} forwardedRef={ref} />
));
