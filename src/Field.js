import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import useUncontrolled from 'uncontrollable/hook';

import { Context } from './Form';

function identity(children) {
  return children;
}

function withProvider(children) {
  return <Provider>{children}</Provider>;
}

const { Provider } = Context;

export const Field = props => {
  const { children, isolate, name } = props;
  const { onInvalid, onChange, ...input } = useUncontrolled(props, {
    error: 'onInvalid',
    value: 'onChange',
  });

  const { set, unset, ...state } = useContext(Context);

  const [error, value] = [
    input.error !== undefined ? input.error : state.error[name],
    input.value !== undefined ? input.value : state.value[name],
  ];

  useEffect(() => {
    if (value !== undefined) {
      set(name, value);
    }

    return () => {
      unset(name);
    };
  }, []);

  useEffect(() => onInvalid(error), [error]);

  const handleChange = after => {
    onChange(after, value);
    set(name, after);
  };

  return (isolate ? withProvider : identity)(
    children({ error, onChange: handleChange, value }),
  );
};

Field.defaultProps = {
  children() {},
  isolate: false,
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

export default Field;
