import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';
// eslint-disable-next-line import/no-extraneous-dependencies
import defer from 'underscore-es/defer';
// eslint-disable-next-line import/no-extraneous-dependencies
import omit from 'underscore-es/omit';

import validate from './validation';

const Context = createContext({
  error: {},
  set() {},
  unset() {},
  value: {},
});

const { Provider } = Context;

const useForm = () => {
  return useContext(Context);
};

const Form = props => {
  const { children, constraint, onInvalid, onSubmit, ...formProps } = omit(
    props,
    'error',
    'onChange',
    'onErrorChange',
    'value',
  );

  const { onChange, onErrorChange, ...input } = useUncontrolled(props, {
    error: 'onErrorChange',
    value: 'onChange',
  });

  const handleChange = useCallback(
    (name, after, before) => {
      onChange(after, before);

      const error = { ...input.error };
      delete error[name];

      if (JSON.stringify(error) !== JSON.stringify(input.error)) {
        onErrorChange(error);
      }
    },
    [JSON.stringify(input.error), onChange, onErrorChange],
  );

  const handleSubmit = event => {
    event.preventDefault();

    const error = validate(input.value, constraint);
    const isValid = Object.keys(error).length === 0;

    if (isValid) {
      onSubmit(input.value);
    } else {
      onErrorChange(error);

      onInvalid(error);
    }
  };

  const set = useCallback(
    (name, value) => {
      defer(() => {
        const before = value;
        const after = { ...before, [name]: value };

        handleChange(name, after, before);
      });
    },
    [handleChange, JSON.stringify(input.value)],
  );

  const unset = useCallback(
    name => {
      defer(() => {
        const before = input.value;
        const after = { ...before };
        delete after[name];

        handleChange(name, after, before);
      });
    },
    [handleChange, JSON.stringify(input.value)],
  );

  const context = useMemo(
    () => ({ error: input.error, set, unset, value: input.value }),
    [JSON.stringify(input.error), set, unset, JSON.stringify(input.value)],
  );

  return (
    <form noValidate {...formProps} onSubmit={handleSubmit}>
      <Provider value={context}>{children}</Provider>
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

export { useForm, Provider };

export default memo(Form);
