import Form from './Form';
import Input from './Input/index';

const Select = Input.extend.attrs({ type: 'select' })``;

export { Form, Input, Select };

export default Form;
