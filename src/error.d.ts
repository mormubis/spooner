import type { List, Collection } from './value.d';

export type Error<V> =
  | undefined
  | (V extends Collection
      ? { [key in keyof V]: Error<V[key]> }
      : V extends List
      ? Error<V[0]>[]
      : string);
