import vjs from 'validate.js';

function validate(values, constraints) {
  const errors = vjs(values, constraints, { fullMessages: false }) || {};

  return Object.keys(errors).reduce(
    (acc, key) => ({ ...acc, [key]: errors[key][0] }),
    {},
  );
}

function number(value, options) {
  return vjs.single(value, {
    numericality: { ...options, strict: true },
  });
}

function required(value, options) {
  return vjs.single(value, {
    presence: { ...options, allowEmpty: false },
  });
}

function shape(value = {}, constraints) {
  const errors = validate(value, constraints);

  return Object.keys(errors).length ? [errors] : undefined;
}

function arrayOf(value = [], constraints) {
  const errors = value
    .map(item => shape(item, constraints))
    .map(item => item && item[0]);

  return errors.filter(item => item).length ? [errors] : undefined;
}

vjs.validators = {
  ...vjs.validators,
  arrayOf,
  number,
  oneOf: vjs.validators.inclusion,
  required,
  shape,
};

export default validate;
