import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withField from '../with/field';

export class Radio extends Component {
  static defaultProps = {
    onBlur() {},
    onChange() {},
    onFocus() {},
  };

  static propTypes = {
    content: PropTypes.any.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.any,
  };

  handleChange = event => {
    const { onChange } = this.props;

    event.stopPropagation();

    onChange(event.target.checked ? content : value);
  };

  render() {
    const { content, value, ...props } = this.props;

    return (
      <input
        {...props}
        checked={content === value}
        onChange={this.handleChange}
      />
    );
  }
}

export default withField(Radio);
