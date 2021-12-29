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
type Props = OwnProps & Omit<React.ComponentPropsWithRef<'textarea'>, keyof OwnProps>;

const TextArea = forwardRef(
  (
    { name, onBlur = () => {}, onFocus = () => {}, ...input }: Props,
    ref: React.Ref<HTMLTextAreaElement>,
  ) => {
    const field = { ...pick(input, ...FIELD_PROPS), name };
    const props = { ...omit(input, ...FIELD_PROPS), name };

    const { error, change, value = '' } = useField<string>(field);

    const handleBlur = () => {
      onBlur();
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value: after } = event.target;

      event.stopPropagation();

      change(after);
    };

    const handleFocus = () => {
      onFocus();
    };

    return (
      <textarea
        {...props}
        data-error={!!error}
        data-value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        ref={ref}
        value={value}
      />
    );
  },
);

TextArea.propTypes = {
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default TextArea;
