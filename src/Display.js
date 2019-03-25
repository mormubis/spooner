import { useContext } from 'react';
import PropTypes from 'prop-types';

import { Context } from './Form';

export const Display = ({ children, name }) => {
  const state = useContext(Context);

  return children(state.value[name]);
};

Display.defaultProps = {
  children() {},
};

Display.propTypes = {
  children: PropTypes.func,
  name: PropTypes.string.isRequired,
};

export default Display;
