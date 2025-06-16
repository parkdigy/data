import { vl } from '../src';

describe('vl', () => {
  it('vl', () => {
    expect(vl('value', 'label', { disabled: true })).toEqual({ label: 'label', value: 'value', disabled: true });
  });
});
