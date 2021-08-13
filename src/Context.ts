import { createContext } from 'react';

import type { Error } from '@/error.d';
import type { Value } from '@/value.d';

export type Type = {
  get: <T extends Value>(key: string) => { error: Error<T>; value: T };
  set: (key: string, value: Value) => void;
  unset: (key: string) => void;
};

export default createContext<Type>({
  get<T>() {
    return { error: undefined, value: undefined as unknown as T };
  },
  set() {
    return undefined;
  },
  unset() {
    return undefined;
  },
});
