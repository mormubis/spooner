import React, { useCallback, useState } from 'react';
import { render } from '@testing-library/react';
import ue from '@testing-library/user-event';

import useProxy from '@/use/proxy';

type Props = {
  initialValue?: Record<string, unknown>;
  onChange?: () => void;
};

const UseProxy = ({ initialValue = {}, onChange = () => {} }: Props) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const proxy = useProxy({ onChange, value: initialValue });

  const get = useCallback(() => {
    setValue(JSON.stringify(proxy.get(key)) ?? 'undefined');
  }, [key, proxy, setValue]);

  const set = useCallback(() => {
    try {
      proxy.set(key, JSON.parse(value));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error();
    }
  }, [key, proxy, value]);

  const unset = useCallback(() => {
    proxy.unset(key);
  }, [key, proxy]);

  const values = useCallback(() => {
    setValue(JSON.stringify(proxy.value()));
  }, [key, proxy]);

  const handleKeyChange = useCallback(
    (e: React.ChangeEvent) => {
      setKey((e.target as HTMLInputElement).value);
    },
    [setKey],
  );

  const handleValueChange = useCallback(
    (e: React.ChangeEvent) => {
      setValue((e.target as HTMLInputElement).value);
    },
    [setValue],
  );

  return (
    <div>
      <input data-testid="key" name="key" onChange={handleKeyChange} type="text" value={key} />
      <input
        data-testid="value"
        name="value"
        onChange={handleValueChange}
        type="text"
        value={value}
      />
      <button data-testid="get" onClick={get} type="button">
        get
      </button>
      <button data-testid="set" onClick={set} type="button">
        set
      </button>
      <button data-testid="unset" onClick={unset} type="button">
        unset
      </button>
      <button data-testid="values" onClick={values} type="button">
        values
      </button>
    </div>
  );
};

describe('useProxy', () => {
  it('store some value', () => {
    const { getByTestId } = render(<UseProxy />);

    const key = getByTestId('key') as HTMLInputElement;
    const value = getByTestId('value') as HTMLInputElement;
    const get = getByTestId('get');
    const set = getByTestId('set');

    // read key "some-key"
    ue.type(key, 'some-key');
    ue.click(get);

    expect(key.value).toBe('some-key');
    expect(value.value).toBe('undefined');

    // write key "some-key" with "some-value"
    ue.clear(value);
    ue.type(value, '"some-value"');
    ue.click(set);

    expect(key.value).toBe('some-key');
    expect(value.value).toBe('"some-value"');

    // read "other-key"
    ue.clear(key);
    ue.type(key, 'other-key');
    ue.click(get);

    expect(key.value).toBe('other-key');
    expect(value.value).toBe('undefined');

    // read "some-key"
    ue.clear(key);
    ue.type(key, 'some-key');
    ue.click(get);

    expect(key.value).toBe('some-key');
    expect(value.value).toBe('"some-value"');
  });

  it('onChange triggered when it is stored a different value', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<UseProxy onChange={onChange} />);

    const key = getByTestId('key') as HTMLInputElement;
    const value = getByTestId('value') as HTMLInputElement;
    const get = getByTestId('get');
    const set = getByTestId('set');

    // read key "some-key"
    ue.type(key, 'some-key');
    ue.click(get);

    expect(key.value).toBe('some-key');
    expect(value.value).toBe('undefined');

    // write key "some-key" with "some-value"
    ue.clear(value);
    ue.type(value, '"some-value"');
    ue.click(set);

    expect(key.value).toBe('some-key');
    expect(value.value).toBe('"some-value"');
    expect(onChange).toHaveBeenCalledWith({ 'some-key': 'some-value' }, {});

    // write key "other-key" with "other-value"
    ue.clear(key);
    ue.type(key, 'other-key');
    ue.clear(value);
    ue.type(value, '"other-value"');
    ue.click(set);

    expect(key.value).toBe('other-key');
    expect(value.value).toBe('"other-value"');
    expect(onChange).toHaveBeenLastCalledWith(
      { 'other-key': 'other-value', 'some-key': 'some-value' },
      { 'some-key': 'some-value' },
    );

    // write AGAIn key "some-key" with "some-value"
    ue.clear(key);
    ue.type(key, 'some-key');
    ue.clear(value);
    ue.type(value, '"some-value"');
    ue.click(set);

    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('remove some key', () => {
    const { getByTestId } = render(<UseProxy />);

    const key = getByTestId('key') as HTMLInputElement;
    const value = getByTestId('value') as HTMLInputElement;
    const get = getByTestId('get');
    const set = getByTestId('set');
    const unset = getByTestId('unset');

    // remove key "some-key"
    ue.type(key, 'some-key');
    ue.click(unset);

    // read key "some-key"
    ue.click(get);

    expect(key.value).toBe('some-key');
    expect(value.value).toBe('undefined');

    // write key "some-key" with "some-value"
    ue.clear(value);
    ue.type(value, '"some-value"');
    ue.click(set);

    expect(key.value).toBe('some-key');
    expect(value.value).toBe('"some-value"');

    // remove key "some-key"
    ue.click(unset);

    // read key "some-key"
    ue.click(get);

    expect(value.value).toBe('undefined');
  });

  it('retrieve proxy value', () => {
    const { getByTestId } = render(<UseProxy initialValue={{ hello: 'world' }} />);

    const key = getByTestId('key') as HTMLInputElement;
    const value = getByTestId('value') as HTMLInputElement;
    const set = getByTestId('set');
    const values = getByTestId('values');

    // read initial state
    ue.click(values);

    expect(value.value).toBe('{"hello":"world"}');

    // write key "some-key" with "some-value"
    ue.type(key, 'some-key');
    ue.clear(value);
    ue.type(value, '"some-value"');
    ue.click(set);

    // read final state
    ue.click(values);

    expect(value.value).toBe('{"hello":"world","some-key":"some-value"}');
  });

  it('updates proxy value', () => {
    const { getByTestId, rerender } = render(<UseProxy initialValue={{ hola: 'mundo' }} />);

    const key = getByTestId('key') as HTMLInputElement;
    const value = getByTestId('value') as HTMLInputElement;
    const set = getByTestId('set');
    const values = getByTestId('values');

    // read initial state
    ue.click(values);

    expect(value.value).toBe('{"hola":"mundo"}');

    rerender(<UseProxy initialValue={{ hello: 'world' }} />);

    // write key "some-key" with "some-value"
    ue.type(key, 'some-key');
    ue.clear(value);
    ue.type(value, '"some-value"');
    ue.click(set);

    // read final state
    ue.click(values);

    expect(value.value).toBe('{"hello":"world","some-key":"some-value"}');
  });
});
