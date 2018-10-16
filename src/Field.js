import React, { PureComponent } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';
import _ from 'underscore';

import { Consumer } from './Form';
import withControlledProp from './with/controlledProp';

function withinForm(WrappedComponent) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name;

  class Formed extends PureComponent {
    static defaultProps = {
      onChange() {},
    };

    static propTypes = {
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func,
    };

    static displayName = `withinForm(${displayName})`;

    render() {
      const { name, ...props } = this.props;

      return (
        <Consumer>
          {({ error, set, unset, value }) => (
            <WrappedComponent
              {...props}
              error={props.error !== undefined ? props.error : error[name]}
              name={name}
              set={set}
              unset={unset}
              value={props.value !== undefined ? props.value : value[name]}
            />
          )}
        </Consumer>
      );
    }
  }

  hoistNonReactStatics(Formed, WrappedComponent);

  return Formed;
}

export class Field extends PureComponent {
  static defaultProps = {
    children() {},
    onChange() {},
    onValueChange() {},
  };

  static propTypes = {
    children: PropTypes.func,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    set: PropTypes.func,
    unset: PropTypes.func,
    value: PropTypes.any,
  };

  componentDidMount() {
    const { name, set, value } = this.props;

    console.log('set - field', name, value);
    set(name, value);
  }

  componentDidUpdate(prevProps) {
    const { name, onChange, value } = this.props;

    if (!_.isEqual(value, prevProps.value)) {
      onChange(name, value, prevProps.value);
    }
  }

  componentWillUnmount() {
    const { name, unset } = this.props;

    unset(name);
  }

  handleChange = (value) => {
    const { name, set } = this.props;

    set(name, value);
  };

  render() {
    const { children, error, value } = this.props;

    return children({ error, onChange: this.handleChange, value });
  }
}

export default _.compose(
  withinForm,
  withControlledProp('value', 'onChange'),
)(Field);
