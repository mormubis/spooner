import React, { createContext, PureComponent } from 'react';
import PropTypes from 'prop-types';
import compose from 'underscore-es/compose';
import defer from 'underscore-es/defer';

import { validate } from './validation';

import withControlledProp from './with/controlledProp';

const { Consumer, Provider } = createContext({
  error: {},
  set() {},
  unset() {},
  value: {},
});

export { Consumer };

export class Form extends PureComponent {
  static defaultProps = {
    error: {},
    onChange() {},
    onErrorChanged() {},
    onInvalid() {},
    onSubmit() {},
    value: {},
  };

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    constraint: PropTypes.object,
    error: PropTypes.object,
    onChange: PropTypes.func,
    onErrorChanged: PropTypes.func,
    onInvalid: PropTypes.func,
    onSubmit: PropTypes.func,
    value: PropTypes.object,
  };

  validate(value) {
    console.log('validate', value);
    const { constraint, onErrorChanged, onInvalid } = this.props;

    const error = validate(value, constraint);
    const isValid = Object.keys(error).length === 0;

    onErrorChanged(error);

    if (!isValid) {
      onInvalid(error);
    }

    return isValid;
  }

  handleChange(name, after, before) {
    const { error: prevError, onChange, onErrorChanged } = this.props;

    onChange(after, before);

    const error = { ...prevError };
    delete error[name];

    if (JSON.stringify(error) !== JSON.stringify(prevError)) {
      onErrorChanged(error);
    }
  }

  handleSubmit = event => {
    const { onSubmit, value } = this.props;

    event.preventDefault();

    if (this.validate(value)) {
      onSubmit(value);
    }
  };

  set = (name, value) => {
    defer(() => {
      console.log('set', name, value, this.props.value);
      const { value: before } = this.props;
      const after = { ...before, [name]: value };

      this.handleChange(name, after, before);
    });
  };

  unset = name => {
    defer(() => {
      const { value: before } = this.props;
      const after = { ...before };
      delete after[name];

      this.handleChange(name, after, before);
    });
  };

  render() {
    const { set, unset } = this;
    const {
      children,
      error,
      onChange,
      onErrorChanged,
      onInvalid,
      value,
      ...props
    } = this.props;

    return (
      <form noValidate {...props} onSubmit={this.handleSubmit}>
        <Provider value={{ error, set, unset, value }}>{children}</Provider>
      </form>
    );
  }
}

export default compose(
  withControlledProp('error'),
  withControlledProp('value', 'onChange'),
)(Form);
