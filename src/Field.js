import React, { memo, useCallback, useDebugValue, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';

import Blocker from './Blocker';
import { useForm } from './Form';

/**
 * @param {Array} children JSX children
 *
 * @returns {Array} itself
 */
function identity(children) {
  return children;
}

/**
 * @param {Array} children JSX children
 *
 * @returns {Array} children wrapped by Blocker
 */
function withProvider(children) {
  return <Blocker>{children}</Blocker>;
}

const useField = input => {
  if (typeof input === 'string') {
    return useField({ name: input });
  }

  const { name, ...props } = input;

  const { set, unset, ...context } = useForm();

  const {
    error,
    onChange = () => {},
    onInvalid = () => {},
    value,
  } = useUncontrolled(
    {
      ...props,
      error: props.error !== undefined ? props.error : context.error[name],
      value: props.value !== undefined ? props.value : context.value[name],
    },
    {
      error: 'onInvalid',
      value: 'onChange',
    },
  );

  useDebugValue({ error, value });

  useEffect(() => {
    if (
      value !== undefined &&
      JSON.stringify(value) !== JSON.stringify(context.value[name])
    ) {
      set(name, value);
    }

    return () => {
      unset(name);
    };
  }, []);

  useEffect(() => {
    if (error !== undefined) {
      onInvalid(error);
    }
  }, [JSON.stringify(error)]);

  const handleChange = useCallback(
    after => {
      const before = value;

      set(name, after);

      onChange(after, before);
    },
    [name, set, JSON.stringify(value)],
  );

  return { ...props, error, name, onChange: handleChange, value };
};

const Field = ({ children = () => {}, isolate = true, ...input }) => {
  const { error, onChange = () => {}, value } = useField(input);

  return (isolate ? withProvider : identity)(
    children({ error, onChange, value }),
  );
};

Field.propTypes = {
  children: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isolate: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onInvalid: PropTypes.func,
  value: PropTypes.any,
};

export { useField };

export default memo(Field);
