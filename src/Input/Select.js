import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import withField from '../with/field';

export class Select extends PureComponent {
  static defaultProps = {
    multiple: false,
    onBlur() {},
    onChange() {},
    onFocus() {},
  };

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    multiple: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
  };

  element = createRef();

  componentDidMount() {
    const { onChange, value: before } = this.props;

    const after = this.getValue(before);

    if (!_.isEqual(after, before)) {
      onChange(after);
    }
  }

  componentDidUpdate(prevProps) {
    const { onChange, value } = this.props;

    const after = this.getValue(value);

    if (value !== prevProps.value && !_.isEqual(after, value)) {
      onChange(after);
    }
  }

  getOption(needle) {
    const { multiple } = this.props;
    const options = Array.from(this.element.current.options);

    return (
      options.find(({ value: option }) => option === needle) ||
      (multiple ? undefined : options[0])
    );
  }

  getValue(raw) {
    const { multiple } = this.props;
    const options = Array.from(this.element.current.options);
    const value = Array.isArray(raw) ? raw : [raw];

    let selected = value
      .map(item => this.getOption(item))
      .filter(Boolean)
      .map(option => option.value);

    if (selected.length === 0) {
      const initial = options[0] || {};

      selected = [initial.value];
    }

    return multiple ? selected : selected[0];
  }

  handleBlur = () => {
    const { onBlur } = this.props;

    onBlur();
  };

  handleChange = event => {
    const { onChange } = this.props;

    event.stopPropagation();

    const raw = Array.from(event.target.selectedOptions).map(
      option => option.value,
    );
    const after = this.getValue(raw);

    onChange(after);
  };

  handleFocus = () => {
    const { onFocus } = this.props;

    onFocus();
  };

  render() {
    const { children, value, ...props } = this.props;

    return (
      <select
        {...props}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        ref={this.element}
        value={value}
      >
        {children}
      </select>
    );
  }
}

export default withField(Select);
