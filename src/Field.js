import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import compose from 'underscore-es/compose';

import { Consumer, Provider } from './Form';
import withControlledProp from './with/controlledProp';

function identity(children) {
  return children;
}

function withProvider(children) {
  return <Provider>{children}</Provider>;
}

export class Connector extends PureComponent {
  static defaultProps = {
    onChange() {},
    set() {},
    unset() {},
  };

  static propTypes = {
    children: PropTypes.func,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    name: PropTypes.string,
    onChange: PropTypes.func,
    set: PropTypes.func,
    unset: PropTypes.func,
    value: PropTypes.any,
  };

  componentDidMount() {
    const { name, set, value } = this.props;

    if (value !== undefined) {
      set(name, value);
    }
  }

  componentWillUnmount() {
    const { name, unset } = this.props;

    unset(name);
  }

  handleChange = after => {
    const { name, onChange, set, value: before } = this.props;

    onChange(after, before);
    set(name, after);
  };

  render() {
    const { children, error, value } = this.props;

    return children({ error, onChange: this.handleChange, value });
  }
}

export class Field extends PureComponent {
  static defaultProps = {
    children() {},
    isolate: false,
    onChange() {},
  };

  static propTypes = {
    children: PropTypes.func,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    isolate: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  render() {
    const { children, error, isolate, name, onChange, value } = this.props;

    return (
      <Consumer>
        {state =>
          (isolate ? withProvider : identity)(
            <Connector
              error={error !== undefined ? error : state.error[name]}
              name={name}
              onChange={onChange}
              set={state.set}
              unset={state.unset}
              value={value !== undefined ? value : state.value[name]}
            >
              {children}
            </Connector>,
          )
        }
      </Consumer>
    );
  }
}

export default compose(
  withControlledProp('error', 'onError'),
  withControlledProp('value', 'onChange'),
)(Field);
