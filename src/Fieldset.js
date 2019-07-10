import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useField } from './Field';
import { Provider, useStatus } from './Form';

export const Fieldset = props => {
  const { children, legend, ...input } = props;

  const { onChange = () => {}, ...fieldProps } = useField(input);

  const status = useStatus(fieldProps);

  const set = useCallback(
    (name, value) => {
      const before = status.value;
      const after = { ...before, [name]: value };

      onChange(after, before);
    },
    [onChange],
  );

  const unset = useCallback(
    name => {
      const before = status.value;
      const after = { ...before };
      delete after[name];

      onChange(after, before);
    },
    [onChange],
  );

  const context = useMemo(
    () => ({ error: status.error, set, unset, value: status.value }),
    [JSON.stringify(status.error), set, unset, JSON.stringify(status.value)],
  );

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
