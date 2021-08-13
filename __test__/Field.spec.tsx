import React from 'react';
import { render } from '@testing-library/react';
import ue from '@testing-library/user-event';

import Field from '@/Field';

describe('Field', () => {
  it('exports useField hook', () => {
    const fn = jest.fn(() => null);
    render(<Field name="test">{fn}</Field>);

    expect(fn).toHaveBeenCalled();
  });

  it('uses useField hook', () => {
    const { getByRole } = render(
      <Field<string> name="test">{({ value }) => <input type="text" value={value} />}</Field>,
    );

    const input = getByRole('textbox');

    expect(input).toBeInTheDocument();
  });

  it('sets default value', () => {
    const { getByRole } = render(
      <Field<string> name="test" defaultValue="hello">
        {({ value }) => <input type="text" value={value} />}
      </Field>,
    );

    const input = getByRole('textbox');

    expect(input).toHaveValue('hello');
  });

  it('sets value', () => {
    const { getByRole } = render(
      <Field<string> name="test" value="hola">
        {({ value }) => <input type="text" value={value} />}
      </Field>,
    );

    const input = getByRole('textbox');

    expect(input).toHaveValue('hola');
  });

  it('sets value over defaultValue', () => {
    const { getByRole } = render(
      <Field<string> defaultValue="hello" name="test" value="hola">
        {({ value }) => <input type="text" value={value} />}
      </Field>,
    );

    const input = getByRole('textbox');

    expect(input).toHaveValue('hola');
  });

  it('trigger changes', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <Field<string> name="test" onChange={onChange} value="hello">
        {({ change, value }) => (
          <input type="text" onChange={(e) => change(e.target.value)} value={value} />
        )}
      </Field>,
    );

    const input = getByRole('textbox');

    ue.clear(input);
    ue.type(input, 'hola');

    expect(input).toHaveValue('hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('updates when using defaultValue', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <Field<string> defaultValue="hello" name="test" onChange={onChange}>
        {({ change, value }) => (
          <input type="text" onChange={(e) => change(e.target.value)} value={value} />
        )}
      </Field>,
    );

    const input = getByRole('textbox');

    ue.clear(input);
    ue.type(input, 'hola');

    expect(input).toHaveValue('hola');
    expect(onChange).toHaveBeenCalled();
  });

  it('updates when using value & onChange', () => {
    let v = 'hello';
    const onChange = jest.fn((after) => {
      v = after;
    });
    const { getByRole, rerender } = render(
      <Field<string> name="test" onChange={onChange} value={v}>
        {({ change, value }) => (
          <input type="text" onChange={(e) => change(e.target.value)} value={value} />
        )}
      </Field>,
    );

    const input = getByRole('textbox');

    ue.type(input, '!');

    expect(input).toHaveValue('hello');
    expect(onChange).toHaveBeenCalled();
    expect(v).toBe('hello!');

    rerender(
      <Field<string> name="test" onChange={onChange} value={v}>
        {({ change, value }) => (
          <input type="text" onChange={(e) => change(e.target.value)} value={value} />
        )}
      </Field>,
    );

    expect(input).toHaveValue('hello!');
  });
});
