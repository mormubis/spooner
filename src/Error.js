import React from 'react';
import PropTypes from 'prop-types';

import { useForm } from './Form';

function wrap(content, wrapper) {
  return wrapper(content);
}

const Collection = ({ value }) => (
  <ul>
    {value.map(
      (item, index) =>
        item && (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>
            #{index}: <Error root={false} value={item} />
          </li>
        ),
    )}
  </ul>
);

Collection.propTypes = {
  value: PropTypes.array,
};

const Literal = ({ value }) => <span>{value}</span>;

Literal.propTypes = {
  value: PropTypes.string,
};

const Map = ({ value }) => (
  <ul>
    {Object.entries(value).map(([key, item]) => (
      <li>
        {key}: <Error root={false} value={item} />
      </li>
    ))}
  </ul>
);

Map.propTypes = {
  value: PropTypes.object,
};

const Root = ({ children }) => <div role="alert">{children}</div>;

Root.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const Nested = ({ children }) => children;

const Error = ({ root = true, value: defaults }) => {
  const state = useForm();

  const value = defaults || state.error || {};

  let Type;

  switch (true) {
    case Array.isArray(value):
      Type = Collection;
      break;
    case typeof value === 'object':
      Type = Map;
      break;
    default:
      Type = Literal;
      break;
  }

  return wrap(<Type value={value} />, root ? Root : Nested);
};

Error.propTypes = {
  root: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default Error;
