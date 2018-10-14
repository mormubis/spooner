import React, { createContext, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose, isEqual } from 'underscore';

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
    onChange() {},
    onErrorChanged() {},
    onInvalid() {},
    onSubmit() {},
    value: {},
  };

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    constraint: PropTypes.object,
    error: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onErrorChanged: PropTypes.func,
    onInvalid: PropTypes.func,
    onSubmit: PropTypes.func,
    value: PropTypes.object,
  };

  validate(value) {
    const { constraint, onErrorChange, onInvalid } = this.props;

    const error = validate(value, constraint);
    const isValid = Object.keys(error).length === 0;

    onErrorChange(error);

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

    if (!isEqual(error, prevError)) {
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
    const { value: before } = this.props;
    const after = { ...before, [name]: value };

    this.handleChange(name, after, before);
  };

  unset = name => {
    const { value: before } = this.props;
    const after = { ...before };
    delete after[name];

    this.handleChange(name, after, before);
  };

  render() {
    const { set, unset } = this;
    const { className, children, error, name, value } = this.props;

    return (
      <form
        className={className}
        name={name}
        noValidate
        onSubmit={this.handleSubmit}
      >
        <Provider value={{ error, set, unset, value }}>{children}</Provider>
      </form>
    );
  }
}

export default compose(
  withControlledProp('error'),
  withControlledProp('value', 'onChange'),
)(Form);
