import { useCallback, useMemo } from 'react';
// We will include lodash methods into the build (small impact)
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapValues, merge } from 'lodash';

import type { Error } from '@/error.d';
import type { Field } from '@/field.d';
import type { Collection, Value } from '@/value.d';

import useProxy from './proxy';

type Props<T extends Collection> = {
  defaultError?: Error<T>;
  defaultValue?: T;
  error?: Error<T>;
  onChange?: (after: T, before: T) => void;
  value?: T;
};

export type Set = {
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
  defaultError = {},
  defaultValue = {},
  error,
  onChange = () => {},
  value,
}: Props<Collection> = {}): Set => {
  const handleChange = useCallback(
    (after: Record<string, Field<Value>>, before: Record<string, Field<Value>>) => {
      const current = split(after);
      const previous = split(before);

      onChange(current, previous);
    },
    [onChange],
  );

  const defaults = useMemo(
    () => join(defaultValue, defaultError),
    [JSON.stringify(defaultError), JSON.stringify(defaultValue)],
  );

  const initial = useMemo(
    () => (value || error) && join(value ?? {}, error ?? {}),
    [JSON.stringify(error), JSON.stringify(value)],
  );

  const proxy = useProxy<Field<Value>>({
    defaultValue: defaults,
    onChange: handleChange,
    value: initial,
  });

  const setter = useCallback(
    (key: string, after: Value) => {
      proxy.set(key, { error: undefined, value: after });
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
