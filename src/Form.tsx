import React, { forwardRef, memo, useCallback, useEffect } from 'react';
// We will include lodash methods into the build (small impact)
// eslint-disable-next-line import/no-extraneous-dependencies
import { omit, pick } from 'lodash';
import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';

import type { Error } from '@/error.d';
import type { Collection } from '@/value.d';

import Context from './Context';

import { Props as FieldProps } from './use/field';
import useSet from './use/set';

const { Provider } = Context;

type OwnProps = FieldProps<Collection> & {
  error: Error<Collection>;
  onSubmit?: (value: Collection) => void;
};

type FormProps = OwnProps & Omit<React.ComponentPropsWithRef<'form'>, keyof OwnProps>;

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, onSubmit = () => {}, ...input }: FormProps, ref) => {
    const {
      error,
      onChange,
      onInvalid = () => {},
      value,
    } = useUncontrolled(
      pick(input, 'defaultError', 'defaultValue', 'error', 'onChange', 'onInvalid', 'value'),
      {
        error: 'onInvalid',
        value: 'onChange',
      },
    );

    const context = useSet({ error, onChange, value });

    const handleSubmit = useCallback(
      (event: React.FormEvent) => {
        event.preventDefault();

        onSubmit(context.value());
      },
      [onSubmit],
    );

    const props = omit(
      input,
      'defaultError',
      'defaultValue',
      'error',
      'onChange',
      'onInvalid',
      'value',
    );

    // Triggers onInvalid when there are errors
    useEffect(() => {
      if (error !== undefined) {
        onInvalid(error);
      }
    }, [error]);

    return (
      <form noValidate {...props} ref={ref} onSubmit={handleSubmit}>
        <Provider value={context}>{children}</Provider>
      </form>
    );
  },
);

Form.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  error: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string]).isRequired),
  onChange: PropTypes.func,
  onInvalid: PropTypes.func,
  onSubmit: PropTypes.func,
  value: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.number, PropTypes.string])
      .isRequired,
  ),
};

export default memo(Form);
