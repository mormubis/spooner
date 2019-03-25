import React, { useContext } from 'react';

import { Context } from './Form';

export const Error = () => {
  const state = useContext(Context);

  return (
    <div role="alert">
      <ul>
        {Object.entries(state.error).map(([key, value]) => (
          <li key={key}>
            {key} -{value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Error;
