import React from 'react';
import { render } from '@testing-library/react';
import ue from '@testing-library/user-event';

import Form from '@/Form';
import Input from '@/Input/Input';

describe('<Form />', () => {
  it('expose useForm hook - propagate value', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <Form onChange={onChange} value={{ test: 'hello world' }}>
        <Input name="test" />
      </Form>,
    );

    const input = getByRole('textbox');

    expect(input).toHaveValue('hello world');

    ue.type(input, '!');

    expect(input).toHaveValue('hello world');
  });

  it('expose useForm hook - propagate defaultValue', () => {
    const { getByRole } = render(
      <Form defaultValue={{ test: 'hello world' }}>
        <Input name="test" />
      </Form>,
    );

    const input = getByRole('textbox');

    expect(input).toHaveValue('hello world');

    ue.type(input, '!');

    expect(input).toHaveValue('hello world!');
  });
});
