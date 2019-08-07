import vjs from 'validate.js';

function single(value, constraint) {
  return vjs.single(value, constraint, { fullMessages: false });
}

function multiple(values, constraints) {
  const errors = vjs(values, constraints, { fullMessages: false }) || {};

  return Object.keys(errors).reduce(
    (acc, key) => ({ ...acc, [key]: errors[key][0] }),
    {},
  );
}

function arrayOf(value = [], constraints) {
  const validator =
    'shape' in constraints
      ? rvalue => multiple(rvalue, constraints.shape)
      : rvalue => single(rvalue, constraints);

  const errors = value.map(validator);

  return errors.filter(Boolean).length ? [errors] : undefined;
}

function number(value, options) {
  return single(value, { numericality: { ...options, strict: true } });
}

function required(value, options) {
  return single(value, { presence: { ...options, allowEmpty: false } });
}

function shape(value = {}, constraints) {
  return multiple(value, constraints);
}

vjs.validators = {
  ...vjs.validators,
  arrayOf,
  number,
  oneOf: vjs.validators.inclusion,
  required,
  shape,
};

export default multiple;
