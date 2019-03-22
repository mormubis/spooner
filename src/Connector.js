import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import withControlledProp from './with/controlledProp';

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

export default withControlledProp('value', 'onChange')(Connector);
