import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import defer from 'underscore-es/defer';

import Field from './Field';
import { Context } from './Form';
import withField from './with/field';

const { Provider } = Context;

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

  // eslint-disable-next-line
  keys = this.props.value.map(uuid);

  componentDidUpdate(prevProps) {
    const { value } = this.props;

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
        {keys.map((key, index, array) => (
          <Field key={key} name={key}>
            {context =>
              children({
                ...context,
                $add: add,
                $remove: remove(key),
                array,
                index,
              })
            }
          </Field>
        ))}
      </Provider>
    );
  }
}

export default withField([], true)(Table);
