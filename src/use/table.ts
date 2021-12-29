import { useCallback, useMemo } from 'react';

import type { Collection, List } from '@/value.d';

import useField, { Props as FieldProps } from './field';
import useSet from './set';

export type Props = FieldProps<List>;
type Return = ReturnType<typeof useSet>;

export default (props: Props): Return => {
  const field = useField(props);

  const table = useMemo(() => {}, [field.error, field.value]);

  const change = useCallback((after: Collection, before: Collection) => {}, []);

  return useSet({
    error: field.error,
    onChange: change,
    value: field.value,
  });
};
