import React from 'react';
import PropTypes from 'prop-types';

import { useForm } from './Form';

const Error = ({ value: defaultError }) => {
  const state = useForm();

  const error = defaultError || state.error;

  return (
    <div role="alert">
      <ul>
        {Object.entries(error).map(([key, value]) => (
          <li key={key}>
            {key}: {typeof value === 'object' ? <Error value={value} /> : value}
          </li>
        ))}
      </ul>
    </div>
  );
};

Error.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default Error;
