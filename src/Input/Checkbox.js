import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withField from '../with/field';

export class Checkbox extends Component {
  static defaultProps = {
    onBlur() {},
    onChange() {},
    onFocus() {},
  };

  static propTypes = {
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.any,
  };

  handleChange = event => {
    const { onChange } = this.props;

    event.stopPropagation();

    onChange(event.target.checked);
  };

  render() {
    const { value, ...props } = this.props;

    return (
      <input
        {...props}
        checked={value}
        onChange={this.handleChange}
        type="checkbox"
      />
    );
  }
}

export default withField(Checkbox);
