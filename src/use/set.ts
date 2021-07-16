import { useCallback, useMemo } from 'react';
// We will include lodash methods into the build (small impact)
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapValues, merge } from 'lodash';

import type { Error } from '@/error.d';
import type { Field } from '@/field.d';
import type { Collection, Value } from '@/value.d';

import useProxy from './proxy';

type Props<T extends Collection> = {
  error?: Error<T>;
  onChange?: (after: T) => void;
  value?: T;
};

type Set = {
  get: (key: string) => Field<Value>;
  set: (key: string, value: Value) => void;
  unset: (key: string) => void;
  value: () => Record<string, Field<Value>>;
};

function split(values: Record<string, Field<Value>>): Collection {
  return mapValues(values, (v) => v.value);
}

function join<T extends Collection>(values: T, errors: Error<T>): Record<string, Field<Value>> {
  return merge(
    mapValues(values, (v) => ({ value: v })),
    mapValues(errors, (e) => ({ error: e })),
  );
}

export default ({
  error: initialError = {},
  onChange = () => {},
  value: initialValue = {},
}: Props<Collection> = {}): Set => {
  const handleChange = useCallback(
    (value: Record<string, Field<Value>>) => {
      const current = split(value);

      onChange(current);
    },
    [onChange],
  );

  const initial = useMemo(() => join(initialValue, initialError), [initialError, initialValue]);
  const proxy = useProxy<Field<Value>>({ onChange: handleChange, value: initial });

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
