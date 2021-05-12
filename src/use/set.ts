import { useCallback, useMemo } from 'react';
// We will include lodash methods into the build (small impact)
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapValues, merge } from 'lodash';

import { Error } from '@/error.d';
import { Value } from '@/value.d';

import useProxy from './proxy';

type Props = {
  error?: Error<Record<string, Value>>;
  onChange?: (after: Record<string, Value>) => void;
  value?: Record<string, Value>;
};
type Set = {
  get: (key: string) => { error: Error<Value>; value: Value };
  set: (key: string, value: Value) => void;
  unset: (key: string) => void;
  value: () => Record<string, { error: Error<Value>; value: Value }>;
};

function split<T>(values: Record<string, { error: Error<T>; value: T }>) {
  return mapValues(values, (v) => v.value);
}

function join<T extends Record<string, Value>>(values: T, errors: Error<T>) {
  const result = merge(
    mapValues(values, (v) => ({ value: v })),
    mapValues(errors, (e) => ({ error: e })),
  );

  // IDK why but this propagate types, return merge(...); does not.

  return result;
}

export default ({
  error: initialError = {},
  onChange = () => {},
  value: initialValue = {},
}: Props = {}): Set => {
  const handleChange = useCallback(
    (value: Record<string, { error: Error<Value>; value: Value }>) => {
      const current = split(value);

      onChange(current);
    },
    [onChange],
  );

  const initial = useMemo(() => join(initialValue, initialError), [initialError, initialValue]);
  const proxy = useProxy<{ error: Error<Value>; value: Value }>({
    onChange: handleChange,
    value: initial,
  });

  const setter = useCallback(
    (key: string, value: Value) => {
      proxy.set(key, { error: undefined, value });
    },
    [onChange, proxy],
  );

  const unsetter = useCallback(
    (key: string) => {
      proxy.unset(key);
    },
    [onChange, proxy],
  );

  return useMemo(() => ({ ...proxy, set: setter, unset: unsetter }), [proxy]);
};
