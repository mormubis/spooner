import React, { memo, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import memoize from 'underscore-es/memoize';
import uuid from 'uuid/v4';

import Field, { useField } from './Field';
import { Provider, useStatus } from './Form';

const Table = ({ children, ...props }) => {
  const { onChange = () => {}, ...input } = useField(props);

  const status = useStatus({
    error: input.error || [],
    value: input.value || [],
  });

  const prevValue = useRef(status.value);
  const keys = useRef(status.value.map(() => uuid()));

  if (JSON.stringify(prevValue.current) !== JSON.stringify(status.value)) {
    keys.current = status.value.map(() => uuid());
  }

  const add = useCallback(
    initial => {
      const before = status.value;
      const after = [...before, initial];

      prevValue.current = [...after];
      keys.current.push(uuid());

      onChange(after, before);
    },
    [onChange],
  );

  const remove = useCallback(
    memoize(key => () => {
      const index = keys.current.indexOf(key);

      if (index !== -1) {
        const before = status.value;
        const after = [...before];
        after.splice(index, 1);

        prevValue.current = [...after];
        keys.current = keys.current.filter((_, idx) => idx !== index);

        onChange(after, before);
      }
    }),
    [onChange],
  );

  const set = useCallback(
    (name, value) => {
      const index = keys.current.indexOf(name);

      if (index !== -1) {
        const before = status.value;
        const after = [...before];
        after[index] = value;

        prevValue.current = [...after];

        onChange(after, before);
      }
    },
    [onChange],
  );

  const unset = useCallback(
    name => {
      const index = keys.current.indexOf(name);

      if (index !== -1) {
        const before = status.value;
        const after = [...before];
        delete after[index];

        prevValue.current = [...after];

        onChange(after, before);
      }
    },
    [onChange],
  );

  const mapped = useMemo(
    () =>
      keys.current.reduce(
        ([error, value], key, index) => [
          { ...error, [key]: status.error[index] },
          { ...value, [key]: status.value[index] },
        ],
        [{}, {}],
      ),
    [JSON.stringify(status.error), JSON.stringify(status.value)],
  );

  const context = useMemo(
    () => ({ error: mapped[0], set, unset, value: mapped[1] }),
    [mapped, set, unset],
  );

  return (
    <Provider value={context}>
      {keys.current.map((key, index, array) => (
        <Field key={key} name={key}>
          {field =>
            children({
              ...field,
              $add: add,
              $remove: remove(key),
              array,
              index,
            })
          }
        </Field>
      ))}
    </Provider>
  );
};

Table.propTypes = {
  children: PropTypes.func,
  error: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.array,
};

export default memo(Table);
