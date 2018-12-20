import React, { PureComponent } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';

import Field from '../Field';

export function withField(_defaultValue, _isolate) {
  return WrappedComponent => {
    const displayName = WrappedComponent.displayName || WrappedComponent.name;

    class inField extends PureComponent {
      static defaultProps = {
        defaultValue: _defaultValue,
        isolate: _isolate,
        onChange() {},
      };

      static displayName = `Field(${displayName})`;

      static propTypes = {
        defaultError: PropTypes.any,
        defaultValue: PropTypes.any,
        isolate: PropTypes.bool,
        error: PropTypes.any,
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        value: PropTypes.any,
      };

      render() {
        const {
          defaultError,
          defaultValue,
          error,
          isolate,
          name,
          onChange,
          value,
          ...props
        } = this.props;

        return (
          <Field
            defaultError={defaultError}
            defaultValue={defaultValue}
            error={error}
            isolate={isolate}
            name={name}
            onChange={onChange}
            value={value}
          >
            {context => (
              <WrappedComponent {...props} {...context} name={name} />
            )}
          </Field>
        );
      }
    }

    hoistNonReactStatics(inField, WrappedComponent);

    return inField;
  };
}

export default withField;
