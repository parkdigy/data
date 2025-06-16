import { copy } from '../src';

describe('copy', () => {
  it('copy', () => {
    expect(copy({ v1: '1', v2: 2, v3: { v3_1: '3_1' } })).toEqual({ v1: '1', v2: 2, v3: { v3_1: '3_1' } });
  });
});
