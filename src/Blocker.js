import React from 'react';
import PropTypes from 'prop-types';

import { Provider } from './Form';

const Blocker = ({ children }) => {
  return (
    <Provider
      value={{
        error: {},
        set() {},
        unset() {},
        value: {},
      }}
    >
      {children}
    </Provider>
  );
};

Blocker.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Blocker;
