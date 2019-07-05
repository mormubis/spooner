import React, { memo, useCallback, useDebugValue, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';
// eslint-disable-next-line import/no-extraneous-dependencies
import omit from 'underscore-es/omit';

import { useForm, Provider } from './Form';

function identity(children) {
  return children;
}

function withProvider(children) {
  return <Provider>{children}</Provider>;
}

const useField = ({ name, ...props }) => {
  const { set, unset, ...state } = useForm();

  const { onInvalid, onChange, ...input } = useUncontrolled(props, {
    error: 'onInvalid',
    value: 'onChange',
  });

  const [error, value] = [
    input.error !== undefined ? input.error : state.error[input.name],
    input.value !== undefined ? input.value : state.value[input.name],
  ];

  useDebugValue({ error, value });

  useEffect(() => {
    if (value !== undefined) {
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
      set(name, after);
      onChange(after, value);
    },
    [name, set, JSON.stringify(value)],
  );

  const fieldProps = omit(props, 'error', 'onChange', 'onInvalid', 'value');

  return { error, onChange: handleChange, onInvalid, value, ...fieldProps };
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
