# Spooner

## Installation

```bash
npm install --save spooner react prop-types
```

## API Reference

Form components
* &lt;Form /&gt;
* &lt;Checkbox /&gt;
* &lt;Input /&gt;
* &lt;Radio /&gt;
* &lt;Select /&gt;
* &lt;Textarea /&gt;

Extension components
* &lt;Field /&gt;
* withField

Helper components
* &lt;Error /&gt;


### &lt;Form /&gt;

This is the basic component you are going to need to use. This is part of the 
magic.

#### Props
* children
* constraint
* defaultError
* defaultValue
* error
* onChange
* onInvalid
* onSubmit
* value

##### children: func
The content you want

##### constraint?: object
Validation

##### defaultValue?: object
Initial values of the form

##### error?: object
Use error as a controlled prop, this prop will reflects the changes on the error of the form

##### onChange?: func
Function that fires each time a change is taken in the form

##### onInvalid?: func
Function that fires each time validation went wrong

##### onSubmit: func
Function that fires after validation has been passed

##### value?: object
Value as a controlled prop, this prop will reflects the changes on the error of the form

#### Example
```jsx
import React from 'react';
import { Form, Input } from 'spooner';

class Login extends Component {
    login = async (values) => {
        // ... some checks
    };

    render() {
        return (
            <Form onSubmit={this.login}>
                <Input name"user" />
                <Input name"password" type="password" />
                <button>Log in</button>
            </Form>
        );
    }
}
```
