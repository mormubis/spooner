import React, { forwardRef, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useField } from './Field';
import { Provider, useStatus } from './Form';

export const Fieldset = ({ children, forwardedRef, legend, ...input }) => {
  const { onChange = () => {}, ...props } = useField(input);

  const [status, setValue] = useStatus({
    // eslint-disable-next-line react/destructuring-assignment
    error: props.error || {},
    // eslint-disable-next-line react/destructuring-assignment
    value: props.value || {},
  });

  const set = useCallback(
    (name, value) => {
      const before = status.value;
      const after = { ...before, [name]: value };

      setValue(after);
      onChange(after, before);
    },
    [onChange],
  );

  const unset = useCallback(
    name => {
      const before = status.value;
      const after = { ...before };
      delete after[name];

      setValue(after);
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
      <fieldset {...props} ref={forwardedRef}>
        {legend && <legend>{legend}</legend>}
        {children}
      </fieldset>
    </Provider>
  );
};

Fieldset.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  error: PropTypes.object,
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.element) }),
  ]),
  legend: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.object,
};

export default memo(
  forwardRef((props, ref) => <Fieldset {...props} forwardedRef={ref} />),
);
