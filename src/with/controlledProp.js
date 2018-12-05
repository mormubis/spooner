import React, { PureComponent } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';

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

    class ControlledProp extends PureComponent {
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
        [propName]:
          this.props[propName] !== undefined
            ? this.props[propName]
            : this.props[`default${PropName}`],
      };

      componentDidUpdate() {
        this.isControlled = this.props[propName] !== undefined;
      }

      handleChange = after => {
        const { [callbackName]: onChange } = this.props;

        if (this.isControlled) {
          const { [propName]: before } = this.props;

          if (after !== before) {
            onChange(after, before);
          }
        } else {
          (() => {
            let before;
            this.setState(
              prevState => {
                ({ [propName]: before } = prevState);

                if (after !== before) {
                  return { [propName]: after };
                }

                return undefined;
              },
              () => after !== before && onChange(after, before),
            );
          })();
        }
      };

      render() {
        const { isControlled, props, state } = this;
        const { [propName]: value } = isControlled ? props : state;

        return (
          <WrappedComponent
            {...props}
            // We need this object because of the interpolation name of the keys
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
