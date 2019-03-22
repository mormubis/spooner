import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Connector from './Connector';
import { Consumer, Provider } from './Form';
import withControlledProp from './with/controlledProp';

function identity(children) {
  return children;
}

function withProvider(children) {
  return <Provider>{children}</Provider>;
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

export default withControlledProp('error', 'onError')(Field);
