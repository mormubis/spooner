import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import defer from 'underscore-es/defer';
// eslint-disable-next-line import/no-extraneous-dependencies
import memoize from 'underscore-es/memoize';
import uuid from 'uuid/v4';

import Field, { useField } from './Field';
import { Provider } from './Form';

const Table = props => {
  const { children, ...input } = props;

  const { error, onChange, value } = useField(input);

  const keys = useRef(value.map(uuid));
  const firstRender = useRef(true);

  useEffect(() => {
    if (!firstRender) {
      keys.current = value.map(uuid);
    }

    firstRender.current = false;
  }, [JSON.stringify(value)]);

  const add = useCallback(
    defaultValue => {
      defer(() => {
        const after = [...value, defaultValue];

        onChange(after, value);
      });
    },
    [onChange, JSON.stringify(value)],
  );

  const remove = useCallback(
    memoize(key => () => {
      defer(() => {
        const index = keys.current.indexOf(key);

        if (index !== -1) {
          const after = [...value].splice(index, 1);

          onChange(after, value);
        }
      });
    }),
    [onChange, JSON.stringify(value)],
  );

  const set = useCallback(
    (name, v) => {
      defer(() => {
        const index = keys.current.indexOf(name);

        if (index !== -1) {
          const after = [...value];
          after[index] = v;

          onChange(after, value);
        }
      });
    },
    [keys.current, onChange, JSON.stringify(value)],
  );

  const unset = useCallback(
    name => {
      defer(() => {
        const index = keys.current.indexOf(name);

        if (index !== -1) {
          const after = [...value];
          delete after[index];

          onChange(after, value);
        }
      });
    },
    [keys.current, onChange, JSON.stringify(value)],
  );

  const mapped = useMemo(
    () =>
      keys.reduce(
        ([accError, accValue], key, index) => [
          { ...accError, [key]: error[index] },
          { ...accValue, [key]: value[index] },
        ],
        [{}, {}],
      ),
    [JSON.stringify(error), JSON.stringify(value)],
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
