import type { Error } from '@/error.d';
import type { Value } from '@/value.d';

export type Field<T extends Value> = {
  error: Error<T>;
  value: T;
};
