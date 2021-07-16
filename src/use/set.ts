import { useCallback, useMemo } from 'react';
// We will include lodash methods into the build (small impact)
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapValues, merge } from 'lodash';

import { Error } from '@/error.d';
import { Value } from '@/value.d';

import useProxy from './proxy';

type Pair<T extends Value> = {
  error: Error<T>;
  value: T;
};

type Props<T extends Record<string, Value>> = {
  error?: Error<T>;
  onChange?: (after: T) => void;
  value?: T;
};

type Set = {
  get: (key: string) => Pair<Value>;
  set: (key: string, value: Value) => void;
  unset: (key: string) => void;
  value: () => Record<string, Pair<Value>>;
};

function split(values: Record<string, Pair<Value>>): Record<string, Value> {
  return mapValues(values, (v) => v.value);
}

function join<T extends Record<string, Value>>(
  values: T,
  errors: Error<T>,
): Record<string, Pair<Value>> {
  return merge(
    mapValues(values, (v) => ({ value: v })),
    mapValues(errors, (e) => ({ error: e })),
  );
}

export default ({
  error: initialError = {},
  onChange = () => {},
  value: initialValue = {},
}: Props<Record<string, Value>> = {}): Set => {
  const handleChange = useCallback(
    (value: Record<string, Pair<Value>>) => {
      const current = split(value);

      onChange(current);
    },
    [onChange],
  );

  const initial = useMemo(() => join(initialValue, initialError), [initialError, initialValue]);
  const proxy = useProxy<Pair<Value>>({ onChange: handleChange, value: initial });

  const setter = useCallback(
    (key: string, value: Value) => {
      proxy.set(key, { error: undefined, value });
    },
    [proxy],
  );

  const unsetter = useCallback(
    (key: string) => {
      proxy.unset(key);
    },
    [proxy],
  );

  return useMemo(() => ({ ...proxy, set: setter, unset: unsetter }), [proxy]);
};
