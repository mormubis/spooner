import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import { Consumer } from './Form';
import withControlledProp from './with/controlledProp';

class Connector extends PureComponent {
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
    const { set, value } = this.props;

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

class Field extends PureComponent {
  static defaultProps = {
    children() {},
    onChange() {},
  };

  static propTypes = {
    children: PropTypes.func,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  render() {
    const { props } = this;

    return (
      <Consumer>
        {({ error, set, unset, value }) => (
          <Connector
            error={props.error !== undefined ? props.error : error[name]}
            name={name}
            onChange={props.onChange}
            set={set}
            unset={unset}
            value={props.value !== undefined ? props.value : value[name]}
          >
            {props.children}
          </Connector>
        )}
      </Consumer>
    );
  }
}

export default _.compose(
  withControlledProp('error', 'onError'),
  withControlledProp('value', 'onChange'),
)(Field);
