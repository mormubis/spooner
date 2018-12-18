import React, { PureComponent } from ' react';
import PropTypes from 'prop-types';
import defer from 'underscore-es/defer';

import { Provider } from './Form';
import withField from './with/field';

export class Fieldset extends PureComponent {
  static propTypes = {
    children: PropTypes.func,
    legend: PropTypes.string,
  };

  set = (name, value) => {
    defer(() => {
      const { onChange, value: before } = this.props;
      const after = { ...before, [name]: value };

      onChange(after, before);
    });
  };

  unset = name => {
    defer(() => {
      const { onChange, value: before } = this.props;
      const after = { ...before };
      delete after[name];

      onChange(after, before);
    });
  };

  render() {
    const { set, unset } = this;
    const { children, error, legend, value, ...props } = this.props;

    return (
      <Provider value={{ error, set, unset, value }}>
        <fieldset {...props}>
          {legend && <legend>{legend}</legend>}
          {children}
        </fieldset>
      </Provider>
    );
  }
}

export default withField({})(Fieldset);
