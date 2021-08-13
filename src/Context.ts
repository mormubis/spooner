import { createContext } from 'react';

import type { Set } from './use/set';

export type FormContext = Omit<Set, 'value'>;

export default createContext<FormContext>({
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
