import type { Value } from '@/value.d';

import useForm from './form';

export default (name: string): Value => {
  const { get } = useForm();

  const context = get(name) ?? {};

  return context.value;
};
