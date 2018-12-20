import React from 'react';
import PropTypes from 'prop-types';

import { Consumer } from './Form';

export function Display() {
  const { name } = this.props;

  return <Consumer>{state => children(state.value[name])}</Consumer>;
}

Display.defaultProps = {
  children() {},
};

Display.propTypes = {
  children: PropTypes.func,
  name: PropTypes.string.isRequired,
};

export default Display;
