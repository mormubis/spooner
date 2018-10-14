import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withStyles } from '@styled-components';

import withForwardRef from '../../with/forwardRef';

import AutoSuggest from './AutoSuggest/index';
import File from './File';
import Phone from './Phone/index';
import Radio from './Radio';
import Select from './Select';
import Text from './Text';
import Textarea from './Textarea';

const Types = {
  autosuggest: AutoSuggest,
  file: File,
  radio: Radio,
  select: Select,
  tel: Phone,
  textarea: Textarea,
};

export const Input = ({ type = 'text', ...props }) => {
  const Element = Types[type] || Text;

  return <Element {...props} type={type} />;
};

Input.propTypes = {
  type: PropTypes.string,
};

export default compose(
  withStyles``,
  withForwardRef,
)(Input);
