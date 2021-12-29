import React, { memo } from 'react';
// import PropTypes from 'prop-types';

import { Value } from '@/value.d';

import Context from './Context';

import type { Props as FieldProps, FieldContext } from './use/field';
import useField from './use/field';

type Props<T extends Value> = FieldProps<T> & {
  children?: ({ change, error, value }: FieldContext<T>) => React.ReactNode;
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
//   error: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
//   name: PropTypes.string.isRequired,
//   onChange: PropTypes.func,
//   onInvalid: PropTypes.func,
//   value: PropTypes.oneOfType([
//     PropTypes.array,
//     PropTypes.bool,
//     PropTypes.number,
//     PropTypes.object,
//     PropTypes.string,
//   ]),
// };

export default memo(Field) as typeof Field;
