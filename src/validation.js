import vjs from 'validate.js';

/**
 * @param {*} value Value to be validated
 * @param {object} constraint Describe constraints
 *
 * @returns {Array|undefined} Error messages or undefined when there is no error
 */
function single(value, constraint) {
  return vjs.single(value, constraint, { fullMessages: false });
}

/**
 * @param {object} values Values to be validated
 * @param {object} constraints Describe constraints
 *
 * @returns {object} Object containing message for each key
 */
function multiple(values, constraints) {
  const errors = vjs(values, constraints, { fullMessages: false }) || {};

  return Object.keys(errors).reduce(
    (acc, key) => ({ ...acc, [key]: errors[key][0] }),
    {},
  );
}

/**
 * @param {Array} value Value to be validated
 * @param {object} constraints Describe constraints
 *
 * @returns {Array} Array containing message for each key
 */
function arrayOf(value = [], constraints) {
  const validator =
    'shape' in constraints
      ? rvalue => multiple(rvalue, constraints.shape)
      : rvalue => single(rvalue, constraints);

  const errors = value.map(validator);

  return errors.filter(
    item => typeof item !== 'object' || Object.keys(item).length > 0,
  ).length > 0
    ? [errors]
    : undefined;
}

/**
 * @param {number} value Value to be validated
 * @param {object} options Constraints for numericality validator
 *
 * @returns {Array|undefined} Error messages or undefined when there is no error
 */
function number(value, options) {
  return single(value, { numericality: { ...options, strict: true } });
}

/**
 * @param {*} value Value to be validated
 * @param {object} options Describe constraints
 *
 * @returns {Array|undefined} Error messages or undefined when there is no error
 */
function required(value, options) {
  return single(value, { presence: { ...options, allowEmpty: false } });
}

/**
 * @param {object} value Value to be validated
 * @param {object} constraints Describe constraints
 *
 * @returns {object} Object containing message for each key
 */
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
