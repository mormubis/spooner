import type { Collection } from '@/value.d';

import useField, { Props as FieldProps } from './field';
import useSet from './set';

export type Props = FieldProps<Collection>;
type Return = ReturnType<typeof useSet>;

export default (props: Props): Return => {
  const field = useField(props);

  return useSet({
    error: field.error,
    onChange: field.change,
    value: field.value,
  });
};
