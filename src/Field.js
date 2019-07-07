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

  const {
    onInvalid = () => {},
    onChange = () => {},
    ...input
  } = useUncontrolled(props, {
    error: 'onInvalid',
    value: 'onChange',
  });

  const controlled = {
    error: props.error !== undefined,
    value: props.value !== undefined,
  };

  const propagated = {
    error: state.error[name] !== undefined,
    value: state.value[name] !== undefined,
  };

  const [error, value] = [
    propagated.error && !controlled.error ? state.error[name] : input.error,
    propagated.value && !controlled.value ? state.value[name] : input.value,
  ];

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

  return { error, onChange: handleChange, value, ...fieldProps };
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
