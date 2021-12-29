import React, { forwardRef } from 'react';
// We will include lodash methods into the build (small impact)
// eslint-disable-next-line import/no-extraneous-dependencies
import { omit, pick } from 'lodash';
import PropTypes from 'prop-types';

import type { Props as FieldProps } from '../use/field';
import useField from '../use/field';

const FIELD_PROPS = ['defaultError', 'defaultValue', 'error', 'onChange', 'onInvalid', 'value'];

type OwnProps = FieldProps<string> & {
  onBlur?: () => void;
  onFocus?: () => void;
};
type Props = OwnProps & Omit<React.ComponentPropsWithRef<'input'>, keyof OwnProps>;

const Input = forwardRef(
  (
    { name, onBlur = () => {}, onFocus = () => {}, type = 'text', ...input }: Props,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const field = { ...pick(input, ...FIELD_PROPS), name };
    const props = { ...omit(input, ...FIELD_PROPS), name };

    const { error, change, value = '' } = useField<string>(field);

    const handleBlur = () => {
      onBlur();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value: after } = event.target;

      event.stopPropagation();

      change(after);
    };

    const handleFocus = () => {
      onFocus();
    };

    return (
      <input
        {...props}
        data-error={!!error}
        data-value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        ref={ref}
        type={type}
        value={value}
      />
    );
  },
);

Input.propTypes = {
  defaultError: PropTypes.string,
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

export default Input;
