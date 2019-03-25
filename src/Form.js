import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import useUncontrolled from 'uncontrollable/hook';
import defer from 'underscore-es/defer';
import omit from 'underscore-es/omit';

import { validate as validation } from './validation';

export const Context = createContext({
  error: {},
  set() {},
  unset() {},
  value: {},
});

const { Provider } = Context;

export const Form = input => {
  const { children, constraint, onInvalid, onSubmit, ...props } = omit(
    input,
    'error',
    'onChange',
    'onErrorChange',
    'value',
  );

  const { error, onChange, onErrorChange, value } = useUncontrolled(props, {
    error: 'onErrorChange',
    value: 'onChange',
  });

  const validate = val => {
    const nextError = validation(val, constraint);
    const isValid = Object.keys(nextError).length === 0;

    onErrorChange(nextError);

    if (!isValid) {
      onInvalid(nextError);
    }

    return isValid;
  };

  const handleChange = (name, after, before) => {
    onChange(after, before);

    const nextError = { ...error };
    delete nextError[name];

    if (JSON.stringify(nextError) !== JSON.stringify(error)) {
      onErrorChange(nextError);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (validate(value)) {
      onSubmit(value);
    }
  };

  const set = (name, val) => {
    defer(() => {
      const before = val;
      const after = { ...before, [name]: val };

      handleChange(name, after, before);
    });
  };

  const unset = name => {
    defer(() => {
      const before = value;
      const after = { ...before };
      delete after[name];

      handleChange(name, after, before);
    });
  };

  return (
    <form noValidate {...props} onSubmit={handleSubmit}>
      <Provider value={{ error, set, unset, value }}>{children}</Provider>
    </form>
  );
};

Form.defaultProps = {
  error: {},
  onChange() {},
  onErrorChange() {},
  onInvalid() {},
  onSubmit() {},
  value: {},
};

Form.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  constraint: PropTypes.object,
  error: PropTypes.object,
  onChange: PropTypes.func,
  onErrorChange: PropTypes.func,
  onInvalid: PropTypes.func,
  onSubmit: PropTypes.func,
  value: PropTypes.object,
};

export default Form;
