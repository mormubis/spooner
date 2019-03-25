import React from 'react';
import PropTypes from 'prop-types';
import defer from 'underscore-es/defer';

import { Context } from './Form';
import withField from './with/field';

const { Provider } = Context;

export const Fieldset = input => {
  const { children, error, legend, onChange, value, ...props } = input;

  const set = (name, val) => {
    defer(() => {
      const before = val;
      const after = { ...before, [name]: val };

      onChange(after, before);
    });
  };

  const unset = name => {
    defer(() => {
      const before = value;
      const after = { ...before };
      delete after[name];

      onChange(after, before);
    });
  };

  return (
    <Provider value={{ error, set, unset, value }}>
      <fieldset {...props}>
        {legend && <legend>{legend}</legend>}
        {children}
      </fieldset>
    </Provider>
  );
};

Fieldset.defaultProps = {
  error: {},
  onChange() {},
  value: {},
};

Fieldset.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  error: PropTypes.object,
  legend: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.object,
};

export default withField({})(Fieldset);
