import React, { memo, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import memoize from 'underscore-es/memoize';
import uuid from 'uuid/v4';

import Field, { useField } from './Field';
import { Provider, useStatus } from './Form';

const Table = ({ children = () => {}, ...props }) => {
  const { onChange = () => {}, ...input } = useField(props);

  const status = useStatus({
    error: input.error || [],
    value: input.value || [],
  });

  const innerValue = useRef(status.value);
  const keys = useRef(status.value.map(() => uuid()));

  if (JSON.stringify(innerValue.current) !== JSON.stringify(status.value)) {
    innerValue.current = [...status.value];
    keys.current = status.value.map(() => uuid());
  }

  const add = useCallback(
    initial => {
      const before = status.value;
      const after = [...before, initial];

      innerValue.current = [...after];
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
        const after = before.filter((ignore, rindex) => rindex !== index);

        innerValue.current = [...after];
        keys.current = keys.current.filter(
          (ignore, rindex) => rindex !== index,
        );

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

        innerValue.current = [...after];

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

        innerValue.current = [...after];

        onChange(after, before);
      }
    },
    [onChange],
  );

  const context = useMemo(() => {
    const error = keys.current.reduce(
      (acc, key, index) => ({ ...acc, [key]: status.error[index] }),
      {},
    );

    const value = keys.current.reduce(
      (acc, key, index) => ({ ...acc, [key]: status.value[index] }),
      {},
    );

    return { error, set, unset, value };
  }, [JSON.stringify(status.error), set, unset, JSON.stringify(status.value)]);

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
              name: `${props.name}-${key}`,
            })
          }
        </Field>
      ))}
    </Provider>
  );
};

Table.propTypes = {
  children: PropTypes.func.isRequired,
  error: PropTypes.array,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.array,
};

export default memo(Table);
