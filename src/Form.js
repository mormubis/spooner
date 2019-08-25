import React, {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';

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

const useValue = name => {
  const { set, unset, ...context } = useForm();

  return { error: context.error[name], value: context.value[name] };
};

const useStatus = nextState => {
  const state = useRef({ error: {}, value: {} });

  state.current = {
    error: nextState.error || {},
    value: nextState.value || {},
  };

  // eslint-disable-next-line fp/no-proxy
  return new Proxy(
    {},
    {
      get(target, prop) {
        return state.current[prop];
      },
    },
  );
};

const Form = input => {
  const {
    children,
    constraint,
    onInvalid = () => {},
    onSubmit = () => {},
    ...props
  } = input;

  const { onChange, onErrorChange, ...rest } = useUncontrolled(input, {
    error: 'onErrorChange',
    value: 'onChange',
  });

  const status = useStatus(rest);

  const handleChange = useCallback(
    (name, after, before) => {
      onChange(after, before);

      const error = { ...status.error };
      // eslint-disable-next-line fp/no-delete
      delete error[name];

      if (JSON.stringify(error) !== JSON.stringify(status.error)) {
        onErrorChange(error);
      }
    },
    [onChange, onErrorChange],
  );

  const handleSubmit = event => {
    event.preventDefault();

    const error = validate(status.value, constraint);
    const isValid = Object.keys(error).length === 0;

    if (isValid) {
      onSubmit(status.value);
    } else {
      onErrorChange(error);

      onInvalid(error);
    }
  };

  const set = useCallback(
    (name, value) => {
      const before = status.value;
      const after = { ...before, [name]: value };

      handleChange(name, after, before);
    },
    [handleChange],
  );

  const unset = useCallback(
    name => {
      const before = status.value;
      const after = { ...before };
      // eslint-disable-next-line fp/no-delete
      delete after[name];

      handleChange(name, after, before);
    },
    [handleChange],
  );

  const context = useMemo(
    () => ({ error: status.error, set, unset, value: status.value }),
    [JSON.stringify(status.error), set, unset, JSON.stringify(status.value)],
  );

  return (
    <form
      noValidate
      {...{
        ...props,
        error: undefined,
        onChange: undefined,
        onErrorChange: undefined,
        value: undefined,
      }}
      onSubmit={handleSubmit}
    >
      <Provider value={context}>{children}</Provider>
    </form>
  );
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

export { Provider, useForm, useStatus, useValue };

export default memo(
  forwardRef((props, ref) => <Form {...props} forwardedRef={ref} />),
);
