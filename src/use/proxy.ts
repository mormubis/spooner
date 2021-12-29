import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

type Props<T> = {
  defaultValue?: ProxyTarget<T>;
  onChange?: (after: ProxyTarget<T>, before: ProxyTarget<T>) => void;
  value?: ProxyTarget<T>;
};

type Proxy<T> = {
  get: (key: string) => T;
  set: (key: string, value: T) => void;
  unset: (key: string) => void;
  value: () => ProxyTarget<T>;
};

type ProxyTarget<T> = Record<string, T>;

export default <T>({
  defaultValue = {},
  onChange = () => {},
  value: paramValue,
}: Props<T> = {}): Proxy<T> => {
  const hooked = useRef(false);
  const stateRef = useRef<ProxyTarget<T>>(defaultValue);
  const wasParamRef = useRef(paramValue !== undefined);

  const isParam = paramValue !== undefined;
  const wasParam = wasParamRef.current;
  wasParamRef.current = isParam;

  if (!isParam && wasParam) {
    stateRef.current = defaultValue;
  }

  const targetRef = useRef<ProxyTarget<T>>({});
  // Typescript does not like isParam :\
  // targetRef.current = isParam ? paramValue : stateRef.current;
  targetRef.current = paramValue !== undefined ? paramValue : stateRef.current;

  const getter = useCallback((key: string) => targetRef.current[key], [targetRef]);

  const value = useCallback(() => {
    return targetRef.current;
  }, [targetRef]);

  const setter = useCallback(
    (key: string, after: T) => {
      const before = getter(key);

      if (hooked.current && JSON.stringify(after) !== JSON.stringify(before)) {
        const previous = { ...value() };
        const next = { ...previous, [key]: after };

        onChange(next, previous);
        stateRef.current = next;

        if (!isParam) {
          targetRef.current = stateRef.current;
        }
      }
    },
    [isParam, onChange, targetRef, value],
  );

  const unsetter = useCallback(
    (key: string) => {
      const before = getter(key);

      if (hooked && before !== undefined) {
        const previous = { ...value() };
        const next = { ...previous };
        delete next[key];

        onChange(next, previous);
        stateRef.current = next;

        if (!isParam) {
          targetRef.current = stateRef.current;
        }
      }
    },
    [isParam, onChange, targetRef, value],
  );

  useLayoutEffect(() => {
    // componentDidMount
    hooked.current = true;

    return () => {
      // componentWillUnmount
      hooked.current = false;
    };
  }, []);

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
