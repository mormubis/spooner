import React, { Component } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';
import { isEqual } from 'underscore';

function capitalize(propName) {
  return `${propName.charAt(0).toUpperCase()}${propName.slice(1)}`;
}

export function withControlledProp(
  propName,
  callbackName = `on${capitalize(propName)}Changed`,
) {
  const PropName = capitalize(propName);

  return WrappedComponent => {
    const displayName = WrappedComponent.displayName || WrappedComponent.name;

    class ControlledProp extends Component {
      static defaultProps = {
        [callbackName]() {},
      };

      static displayName = `withControlledProp[${propName}](${displayName})`;

      static propTypes = {
        [`default${PropName}`]: PropTypes.any,
        [propName]: PropTypes.any,
        [callbackName]: PropTypes.func,
      };

      isControlled = this.props[propName] !== undefined;

      state = {
        [propName]: this.props[propName] || this.props[`default${PropName}`],
      };

      componentDidUpdate() {
        this.isControlled = this.props[propName] !== undefined;
      }

      handleChange = after => {
        const { [callbackName]: onChange } = this.props;

        if (this.isControlled) {
          const { [propName]: before } = this.props;

          if (after instanceof File || !isEqual(after, before)) {
            onChange(after, before);
          }
        } else {
          this.setState(prevState => {
            const { [propName]: before } = prevState;

            if (after instanceof File || !isEqual(after, before)) {
              onChange(after, before);

              return { [propName]: after };
            }

            return undefined;
          });
        }
      };

      render() {
        const { isControlled, props, state } = this;
        const { [propName]: value } = isControlled ? props : state;

        return (
          <WrappedComponent
            {...props}
            {...{
              [callbackName]: this.handleChange,
              [propName]: value,
            }}
          />
        );
      }
    }

    hoistNonReactStatics(ControlledProp, WrappedComponent);

    return ControlledProp;
  };
}

export default withControlledProp;
