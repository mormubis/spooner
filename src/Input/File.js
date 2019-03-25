import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withField from '../with/field';

export class File extends Component {
  static defaultProps = {
    multiple: false,
    onBlur() {},
    onChange() {},
    onFocus() {},
  };

  static propTypes = {
    multiple: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.any,
  };

  handleBlur = () => {
    const { onBlur } = this.props;

    onBlur();
  };

  handleChange = event => {
    const { multiple, onChange } = this.props;
    const { files } = event.target;

    event.stopPropagation();
    onChange(multiple ? files : files[0]);
  };

  handleFocus = () => {
    const { onFocus } = this.props;

    onFocus();
  };

  render() {
    const { value: ignore, ...props } = this.props;

    return (
      <input
        {...props}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        type="file"
      />
    );
  }
}

export default withField()(File);
