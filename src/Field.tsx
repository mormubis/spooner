import React, { memo } from 'react';
// import PropTypes from 'prop-types';

import Context from './Context';

import type { Props as FieldProps, Return } from './use/field';
import useField from './use/field';

import { Value } from './value.d';

type Props<T extends Value> = FieldProps<T> & {
  children: ({ change, error, value }: Return<T>) => React.ReactNode;
};

const { Provider } = Context;

const Field = <T extends Value>({ children = () => null, ...input }: Props<T>) => {
  const { change, error, value } = useField(input);

  return (
    <Provider
      value={{
        get<V>() {
          return { error: undefined, value: undefined as unknown as V };
        },
        set() {
          return undefined;
        },
        unset() {
          return undefined;
        },
      }}
    >
      {children({ change, error, value })}
    </Provider>
  );
};

// Field.propTypes = {
//   children: PropTypes.func,
//   error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
//   isolate: PropTypes.bool,
//   name: PropTypes.string.isRequired,
//   onChange: PropTypes.func,
//   onInvalid: PropTypes.func,
//   value: PropTypes.any,
// };

export { useField };

export default memo(Field);
