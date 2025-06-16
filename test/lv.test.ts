import { lv } from '../src';

describe('lv', () => {
  it('lv', () => {
    expect(lv('label', 'value', { disabled: true })).toEqual({ label: 'label', value: 'value', disabled: true });
  });
});
