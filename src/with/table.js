import React, { PureComponent } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';

import Table from '../Table';

export function withTable(WrappedComponent) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name;

  class inTable extends PureComponent {
    static defaultProps = {
      onChange() {},
    };

    static displayName = `Field(${displayName})`;

    static propTypes = {
      defaultError: PropTypes.array,
      defaultValue: PropTypes.array,
      error: PropTypes.array,
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func,
      value: PropTypes.array,
    };

    render() {
      const {
        defaultError,
        defaultValue,
        error,
        name,
        onChange,
        value,
        ...props
      } = this.props;

      return (
        <Table
          defaultError={defaultError}
          defaultValue={defaultValue}
          error={error}
          name={name}
          onChange={onChange}
          value={value}
        >
          {state => <WrappedComponent {...props} {...state} name={name} />}
        </Table>
      );
    }
  }

  hoistNonReactStatics(inTable, WrappedComponent);

  return inTable;
}

export default withTable;
