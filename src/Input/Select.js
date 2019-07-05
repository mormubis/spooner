import React, { useEffect, useRef } from 'react';

import { useField } from '../Field';

const Select = props => {
  const {
    children,
    error,
    multiple = false,
    onBlur = () => {},
    onChange = () => {},
    onFocus = () => {},
    value,
    ...fieldProps
  } = useField(props);

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
    const after = getValue(value);

    if (JSON.stringify(after) !== JSON.stringify(value)) {
      onChange(after);
    }
  }, [JSON.stringify(value)]);

  return (
    <select
      {...fieldProps}
      data-error={error}
      data-value={value}
      multiple={multiple}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      ref={element}
      value={value}
    >
      {children}
    </select>
  );
};

export default Select;
