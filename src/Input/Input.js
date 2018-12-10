import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withField from '../with/field';

export class Input extends Component {
  static defaultProps = {
    onBlur() {},
    onChange() {},
    onFocus() {},
  };

  static propTypes = {
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  };

  handleBlur = () => {
    const { onBlur } = this.props;

    onBlur();
  };

  handleChange = event => {
    const { onChange } = this.props;

    event.stopPropagation();
    onChange(event.target.value);
  };

  handleFocus = () => {
    const { onFocus } = this.props;

    onFocus();
  };

  render() {
    const { ...props } = this.props;

    return (
      <input
        {...props}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
      />
    );
  }
}

export default withField('')(Input);
