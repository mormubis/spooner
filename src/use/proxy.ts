import { useCallback, useMemo, useRef } from 'react';

type Props<T> = {
  onChange?: (after: ProxyTarget<T>) => void;
  value?: ProxyTarget<T>;
};
type Proxy<T> = {
  get: (key: string) => T;
  set: (key: string, value: T) => void;
  unset: (key: string) => void;
  value: () => ProxyTarget<T>;
};
type ProxyTarget<T> = Record<string, T>;

export default <T>({ onChange = () => {}, value: initialValue = {} }: Props<T> = {}): Proxy<T> => {
  const target = useRef(initialValue);

  const getter = useCallback((key: string) => target.current[key], [target]);

  const value = useCallback(() => target.current, [target]);

  const setter = useCallback(
    (key: string, after: T) => {
      const before = getter(key);

      if (JSON.stringify(after) !== JSON.stringify(before)) {
        target.current[key] = after;

        onChange(value());
      }
    },
    [onChange, target, value],
  );

  const unsetter = useCallback(
    (key: string) => {
      const before = getter(key);

      if (before !== undefined) {
        delete target.current[key];

        onChange(value());
      }
    },
    [onChange, target, value],
  );

  return useMemo(
    () => ({
      get: getter,
      set: setter,
      unset: unsetter,
      value,
    }),
    [getter, setter, unsetter, value],
  );
};
