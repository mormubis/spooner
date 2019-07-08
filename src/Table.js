import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import defer from 'underscore-es/defer';
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

  const keys = useRef(status.value.map(uuid));
  const firstRender = useRef(true);

  useEffect(() => {
    if (!firstRender) {
      keys.current = status.value.map(uuid);
    }

    firstRender.current = false;
  }, [JSON.stringify(status.value)]);

  const add = useCallback(
    initial => {
      defer(() => {
        const before = status.value;
        const after = [...before, initial];

        onChange(after, before);
      });
    },
    [onChange],
  );

  const remove = useCallback(
    memoize(key => () => {
      defer(() => {
        const index = keys.current.indexOf(key);

        if (index !== -1) {
          const before = status.value;
          const after = [...before].splice(index, 1);

          onChange(after, before);
        }
      });
    }),
    [onChange],
  );

  const set = useCallback(
    (name, value) => {
      defer(() => {
        const index = keys.current.indexOf(name);

        if (index !== -1) {
          const before = status.value;
          const after = [...before];
          after[index] = value;

          onChange(after, before);
        }
      });
    },
    [keys.current, onChange],
  );

  const unset = useCallback(
    name => {
      defer(() => {
        const index = keys.current.indexOf(name);

        if (index !== -1) {
          const before = status.value;
          const after = [...before];
          delete after[index];

          onChange(after, before);
        }
      });
    },
    [keys.current, onChange],
  );

  const mapped = useMemo(
    () =>
      keys.reduce(
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
      {keys.map((key, index, array) => (
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
