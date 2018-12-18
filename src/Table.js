import React, { PureComponent } from ' react';
import PropTypes from 'prop-types';
import defer from 'underscore-es/defer';

import Field from './Field';
import { Provider } from './Form';
import withField from './with/field';

function uuid() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

export class Table extends PureComponent {
  static propTypes = {
    children: PropTypes.func,
    error: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.array,
  };

  keys = this.props.value.map(uuid);

  componentDidUpdate(prevProps) {
    if (value !== prevProps.value) {
      this.keys = value.map(uuid);
    }
  }

  add = () => {
    defer(() => {
      const { onChange, value: before } = this.props;
      const after = [...before, undefined];

      onChange(after, before);
    });
  };

  remove = key => () => {
    defer(() => {
      const { onChange, value: before } = this.props;
      const index = this.keys.indexOf(key);

      if (index !== -1) {
        const after = [...before].splice(index, 1);

        onChange(after, before);
      }
    });
  };

  set = (name, value) => {
    defer(() => {
      const { onChange, value: before } = this.props;
      const after = { ...before, [name]: value };

      onChange(after, before);
    });
  };

  unset = name => {
    defer(() => {
      const { onChange, value: before } = this.props;
      const after = { ...before };
      delete after[name];

      onChange(after, before);
    });
  };

  render() {
    const { add, keys, remove, set, unset } = this;
    const { children, error: _error, value: _value } = this.props;

    const [error, value] = keys.reduce(
      ([__error, __value], key, index) => [
        { ...__error, [key]: _error[index] },
        { ...__value, [key]: _value[index] },
      ],
      [{}, {}],
    );

    return (
      <Provider value={{ error, set, unset, value }}>
        {keys.map(key => (
          <Field key={key} name={key}>
            {state => children({ ...state, add: add, remove: remove(key) })}
          </Field>
        ))}
      </Provider>
    );
  }
}

export default withField([], true)(Table);
