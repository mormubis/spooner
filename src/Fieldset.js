import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import defer from 'underscore-es/defer';

import { useField } from './Field';
import { Provider } from './Form';

export const Fieldset = props => {
  const { children, legend, ...input } = props;

  const {
    error = {},
    onChange = () => {},
    value = {},
    ...fieldProps
  } = useField(input);

  const set = useCallback(
    (name, v) => {
      defer(() => {
        const after = { ...value, [name]: v };

        onChange(after, value);
      });
    },
    [onChange, JSON.stringify(value)],
  );

  const unset = useCallback(
    name => {
      defer(() => {
        const after = { ...value };
        delete after[name];

        onChange(after, value);
      });
    },
    [onChange, JSON.stringify(value)],
  );

  const context = useMemo(() => ({ error, set, unset, value }), [
    JSON.stringify(error),
    set,
    unset,
    JSON.stringify(value),
  ]);

  return (
    <Provider value={context}>
      <fieldset {...fieldProps}>
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

export default memo(Fieldset);
