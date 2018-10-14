import React, { PureComponent } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';

import Field from '../../Field';

export function withField(someValue) {
  return WrappedComponent => {
    const displayName = WrappedComponent.displayName || WrappedComponent.name;

    class Fielded extends PureComponent {
      static defaultProps = {
        defaultValue: someValue,
        onChange() {},
      };

      static displayName = `withField(${displayName})`;

      static propTypes = {
        defaultValue: PropTypes.any,
        error: PropTypes.string,
        name: PropTypes.string,
        onChange: PropTypes.func,
        value: PropTypes.any,
      };

      render() {
        const {
          defaultValue,
          error,
          name,
          onChange,
          value,
          ...props
        } = this.props;

        return (
          <Field
            defaultValue={defaultValue}
            error={error}
            name={name}
            onChange={onChange}
            value={value}
          >
            {({ error: _error, onChange, value: _value }) => (
              <WrappedComponent
                {...props}
                error={_error}
                name={name}
                onChange={onChange}
                value={_value}
              />
            )}
          </Field>
        );
      }
    }

    hoistNonReactStatics(Fielded, WrappedComponent);

    return Fielded;
  };
}

export default withField;
