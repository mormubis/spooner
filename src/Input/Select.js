import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withField from './with/field';

export class Select extends Component {
  static defaultProps = {
    onBlur() {},
    onChange() {},
    onFocus() {},
    options: [],
  };

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.any,
      }),
    ),
    value: PropTypes.any,
  };

  componentDidMount() {
    const { onChange, value } = this.props;

    const option = this.option(value);

    if (value !== option.value) {
      onChange(option.value);
    }
  }

  componentDidUpdate(prevProps) {
    const { onChange, value } = this.props;

    const option = this.option(value);

    if (value !== prevProps.value && value !== option.value) {
      onChange(option.value);
    }
  }

  option(needle, key = 'value') {
    const { options } = this.props;

    return options.find(({ [key]: option }) => option === needle) || options[0];
  }

  handleBlur = () => {
    const { onBlur } = this.props;

    onBlur();
  };

  handleChange = event => {
    const { onChange } = this.props;

    event.stopPropagation();

    const needle = event.target.value;
    const after = this.option(needle, 'name');

    onChange(after.value);
  };

  handleFocus = () => {
    const { onFocus } = this.props;

    onFocus();
  };

  render() {
    const { children, options, value: raw, ...props } = this.props;
    const option = this.option(raw);

    return (
      <select
        {...props}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        value={option.name}
      >
        {children
          ? children
          : options.map(({ name: option }) => (
              <option key={option}>{option}</option>
            ))}
      </select>
    );
  }
}

export default withField()(Select);
