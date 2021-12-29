import React, { forwardRef } from 'react';
// We will include lodash methods into the build (small impact)
// eslint-disable-next-line import/no-extraneous-dependencies
import { omit, pick } from 'lodash';
import PropTypes from 'prop-types';

import type { Props as FieldProps } from '../use/field';
import useField from '../use/field';

const FIELD_PROPS = ['defaultError', 'defaultValue', 'error', 'onChange', 'onInvalid', 'value'];

type OwnProps = FieldProps<boolean> & {
  onBlur?: () => void;
  onFocus?: () => void;
};
type Props = OwnProps & Omit<React.ComponentPropsWithRef<'input'>, keyof OwnProps | 'type'>;

const Checkbox = forwardRef(
  (
    { name, onBlur = () => {}, onFocus = () => {}, ...input }: Props,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const field = { ...pick(input, ...FIELD_PROPS), name };
    const props = { ...omit(input, ...FIELD_PROPS), name };

    const { error, change, value = false } = useField<boolean>(field);

    const handleBlur = () => {
      onBlur();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked: after } = event.target;

      event.stopPropagation();

      change(after);
    };

    const handleFocus = () => {
      onFocus();
    };

    return (
      <input
        {...props}
        checked={value}
        data-error={!!error}
        data-value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        ref={ref}
        type="checkbox"
      />
    );
  },
);

Checkbox.propTypes = {
  defaultError: PropTypes.string,
  defaultValue: PropTypes.bool,
  error: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.bool,
};

export default Checkbox;
