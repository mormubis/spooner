# Spooner

In [joinedapp](https://joined.app) we've run several times into the same
problem: how should we deal with forms?

We've tried to use different solutions redux-forms, react-forms. We thought
those solutions are still a little bit artifitial.

That's why using the new Context API and hooks, we've developed a new library
for everybody who wants to use it.

## Getting started

### Installation

```bash
npm install --save spooner
# peer deps
npm install --save react prop-types
```

### Basic usage

From the beginning, you can use directly the exported components.

```javascript
import { Form, Input } from 'spooner';

function handleSubmit(value) {
  console.log(values); // { email: 'adrian@spooner.io', password: 'myP@ssw0rd' }
}
```

```jsx harmony
<Form onSubmit={handleSubmit}>
  <Input name="email" type="text" />
  <Input name="password" type="password" />
  <button type="submit">Send</button>
</Form>
```

Also, `spooner` exports other form components like `Select` and `Textarea`.

Trying to make it easier to work with different kind of inputs as `checkbox`,
`file` or `radio`; they are also provided within the package.

So whenever you used for example a `Checkbox`:

```javascript
import { Checkbox } from 'spooner';

function handleChange(value, prevValue) {
  console.log(value); // true (whenever is checked)
  console.log(prevValue); // false
}
```

```jsx harmony
<Checkbox name="remember" onChange={handleChange} />
```

#### Note about Radio

Due to the "duality" of Radio - its value it's provided from the actual value
attribute whenever this is checked - we applied a different rule with this input.

Prop `value` will be actual value provided from the `form` or prop. And `content`
will be the prop that indicated the new value whenever radio is checked.

```javascript
import { Radio } from 'spooner';

function handleChange(value) {
  console.log(value); // cat, dog or turtle
}
```

```jsx harmony
<Radio content="cat" name="pet" onChange={handleChange} />
<Radio content="dog" name="pet" onChange={handleChange} />
<Radio content="turtle" name="pet" onChange={handleChange} />
```

## Usage

```jsx harmony
import React from 'react';
import { Checkbox, Form, Input } from 'spooner';

const Login = () => {
  const handleSubmit = value => {
    console.log(value); // { password: 'myP@ssw0rd', remember: true, user: 'adrian' }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input name="user" />
      <Input name="password" type="password" />
      <Checkbox name="remember" />

      <button type="submit">Send</button>
    </Form>
  );
};

export default Login;
```

`Form` could be a controlled component, as any other controlled component provides
`defaultValue` and `value` props.

```jsx harmony
import React from 'react';
import { Checkbox, Form, Input } from 'spooner';

const Login = () => {
  const handleSubmit = value => {
    console.log(value); // { password: 'myP@ssw0rd', remember: true, user: 'adrian' }
  };

  return (
    <Form defaultValue={{ remember: true }} onSubmit={handleSubmit}>
      <Input name="user" />
      <Input name="password" type="password" />
      <Checkbox name="remember" />{' '}
      {/* This checkbox will shown checked by default */}
      <button type="submit">Send</button>
    </Form>
  );
};

export default Login;
```

As mention before, `Form` could be controlled. So if we fill `value` prop we need
to update it when is needed.

```jsx harmony
const Login = () => {
  const [value, setValue] = useState({});

  const handleChange = nextValue => {
    setValue(nextValue);
  };

  const handleSubmit = () => {
    console.log(value);
  };

  return (
    <Form onChange={handleChange} onSubmit={handleSubmit} value={value}>
      <Input name="user" />
      <Input name="password" type="password" />
      <Checkbox name="remember" />

      <button type="submit">Send</button>
    </Form>
  );
};
```

Same concept could be applied to any of the inputs (or fields) provided within
`spooner`.

```jsx harmony
const Login = () => {
  const [value, setValue] = useState({});

  const handleChange = nextValue => {
    // it will be executed in the first render with (at least) { remember: true }
    setValue(nextValue);
  };

  const handleSubmit = () => {
    console.log(value);
  };

  return (
    <Form onChange={handleChange} onSubmit={handleSubmit} value={value}>
      <Input name="user" />
      <Input name="password" type="password" />
      <Checkbox defaultValue={true} name="remember" />

      <button type="submit">Send</button>
    </Form>
  );
};
```

#### What's the difference between Form defaultValue and Input defaultValue?

Fair question, first will not trigger any changes on the Form, and the second
will trigger onChange on the form but not in the input (it makes sense because
input didn't change its initial value).

---

There are some times that we want to group fields inside a single key. For that
reason, we provide `Fieldset`. In this case, we increase the capabilities of the
fieldset tag to actually group values together.

```jsx harmony
const ContactInformation = () => {
  const handleSubmit = value => {
    console.log(value); // { address: { city: 'Madrid', number: '27', street: 'Eloy Gonzalo', zipcode: 28010 }, name: 'Adrian', title: 'mr' }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Select name="title">
        <option value="mr">Mister</option>
        <option value="mrs">Miss</option>
      </Select>
      <Input name="name" type="text" />
      <Fieldset name="address">
        <Input name="street" type="text" />
        <Input name="number" type="number" />
        <Input name="city" type="text" />
        <Input name="zipcode" type="text" />
      </Fieldset>
    </Form>
  );
};
```

And sometimes we want some values as an array:

```jsx harmony
const Bill = () => {
  const handleSubmit = value => {
    console.log(value); // { items: [12, 5, 0] }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Table name="items">
        {({ $add, array, index, ...props }) => (
          <>
            Item #{index}
            <Input name="doesn't matter" {...props} type="number" />
            {index === array.length && (
              <button onClick={() => $add(0)} type="button">
                add
              </button>
            )}
          </>
        )}
      </Table>

      <button type="submit">Send</button>
    </Form>
  );
};
```

Or maybe together:

```jsx harmony
const Bill = () => {
  const handleSubmit = value => {
    console.log(value); // { items: [{ amount: 2, name: 'Socks', price: 10 }, { amount: 1, name: 'Shirt', price: 20 }, { amount: 1, name: 'Pin', price: 0 }] }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Table name="items">
        {({ $add, array, index, ...props }) => (
          <Fieldset name="whatever" {...props}>
            Item #{index}
            <Input name="name" type="text" />
            <Input name="amount" type="number" />
            <Input name="price" type="number" />
            {index === array.length && (
              <button onClick={() => $add(0)} type="button">
                add
              </button>
            )}
          </Fieldset>
        )}
      </Table>

      <button type="submit">Send</button>
    </Form>
  );
};
```

### Validation

This was another major pain point when we researched about forms. How can I
validate the information before send it?

Under the hood `spooner` is using [validate.js](https://www.npmjs.com/package/validate.js).

We liked in a very opinionated way the syntax provided by `validate.js`.
Although it seems very verbose in some ocassions, it provides a lot of information
to the reader.

We created a couple of custom validators to provide support for `Fieldset` and
`Table` fields.

<!--
ROADMAP
    - Fix errors in nested fields
    - Change radio and create radiogroup
-->
