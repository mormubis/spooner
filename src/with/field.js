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
        defaultValue: PropTypes.any,
        error: PropTypes.string,
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
            {state => (
              <WrappedComponent
                {...props}
                error={state.error}
                name={name}
                onChange={state.onChange}
                value={state.value}
              />
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
