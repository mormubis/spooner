import { useCallback, useDebugValue, useEffect, useLayoutEffect, useMemo } from 'react';
import { useUncontrolled } from 'uncontrollable';

import type { Error } from '@/error.d';
import type { Field } from '@/field.d';
import type { Value } from '@/value.d';

import useForm from './form';

export type Props<T extends Value> = {
  defaultError?: Error<T>;
  defaultValue?: T;
  error?: Error<T>;
  name: string;
  onChange?: (after: T, before: T) => void;
  onInvalid?: (error: Error<T>) => void;
  value?: T;
};

export type FieldContext<T extends Value> = Field<T> & {
  change: (after: T) => void;
};

export default <T extends Value>({ name, ...props }: Props<T>): FieldContext<T> => {
  const form = useForm();
  const context = form.get<T>(name);

  const {
    error,
    onChange = () => {},
    onInvalid = () => {},
    value,
  } = useUncontrolled(
    {
      ...props,
      error: props.error ?? context.error,
      value: props.value ?? context.value,
    },
    {
      error: 'onInvalid',
      value: 'onChange',
    },
  );

  const change = useCallback(
    (after: T) => {
      const before = value;

      form.set(name, after);

      onChange(after, before);
    },
    [form, name, value],
  );

  // React DevTools :)
  useDebugValue({ error, value });

  // Set any value that is not committed in the form for the first render
  useLayoutEffect(() => {
    if (value !== undefined && JSON.stringify(value) !== JSON.stringify(context.value)) {
      form.set(name, value);
    }

    // Remove the value if the field is unmounted
    return () => {
      form.unset(name);
    };
  }, []);

  // Triggers onInvalid when there are errors
  useEffect(() => {
    if (error !== undefined) {
      onInvalid(error);
    }
  }, [error]);

  return useMemo(() => ({ change, error, value }), [change, error, value]);
};
