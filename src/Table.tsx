import React, { forwardRef } from 'react';
// We will include lodash methods into the build (small impact)
// eslint-disable-next-line import/no-extraneous-dependencies
import { omit, pick } from 'lodash';
// import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import Context from './Context';
import type { Props as FieldsetProps } from './use/fieldset';
import useFieldset from './use/fieldset';

type OwnProps = FieldsetProps & {
  legend?: React.ReactNode;
};

type Props = OwnProps & Omit<React.ComponentPropsWithRef<'fieldset'>, keyof OwnProps>;

const { Provider } = Context;

const FIELD_PROPS = ['defaultError', 'defaultValue', 'error', 'onChange', 'onInvalid', 'value'];

const Table = forwardRef(
  ({ children, legend, name, ...input }: Props, ref: React.Ref<HTMLFieldSetElement>) => {
    const fieldset = { ...pick(input, ...FIELD_PROPS), name };
    const props = { ...omit(input, ...FIELD_PROPS), name };

    const context = useFieldset(fieldset);

    return (
      <Provider value={context}>
        <fieldset {...props} ref={ref}>
          {legend && <legend>{legend}</legend>}
          {children}
        </fieldset>
      </Provider>
    );
  },
);

// Fieldset.propTypes = {
//   children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
//   error: PropTypes.object,
//   forwardedRef: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.element) }),
//   ]),
//   legend: PropTypes.string,
//   name: PropTypes.string.isRequired,
//   onChange: PropTypes.func,
//   value: PropTypes.object,
// };

export default Table;
