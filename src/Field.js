import React, { memo, useCallback, useDebugValue, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';
import omit from 'underscore-es/omit';

import Blocker from './Blocker';
import { useForm } from './Form';

function identity(children) {
  return children;
}

function withProvider(children) {
  return <Blocker>{children}</Blocker>;
}

const useField = ({ name, ...props }) => {
  const { set, unset, ...state } = useForm();

  const {
    error,
    onChange = () => {},
    onInvalid = () => {},
    value,
  } = useUncontrolled(
    {
      ...props,
      error: props.error !== undefined ? props.error : state.error[name],
      value: props.value !== undefined ? props.value : state.value[name],
    },
    {
      error: 'onInvalid',
      value: 'onChange',
    },
  );

  useDebugValue({ error, value });

  useEffect(() => {
    if (value !== undefined && value !== state.value[name]) {
      set(name, value);
    }

    return () => {
      unset(props.name);
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

  const fieldProps = omit(props, 'error', 'onChange', 'onInvalid', 'value');

  return { error, name, onChange: handleChange, value, ...fieldProps };
};

export const Field = props => {
  const { children, isolate, ...input } = props;

  const { error, onChange, value } = useField(input);

  return (isolate ? withProvider : identity)(
    children({ error, onChange, value }),
  );
};

Field.defaultProps = {
  children() {},
  isolate: true,
  onChange() {},
  onInvalid() {},
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
