import React from 'react';
import PropTypes from 'prop-types';

const Errors = ({ error }) => (
  <div role="alert">
    <ul>
      {Object.entries(error).map(([key, value]) => (
        <li key={key}>
          {key} - {value}
        </li>
      ))}
    </ul>
  </div>
);

Errors.propTypes = {
  error: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  ),
};

export default Errors;
