import { makeConst } from '../src';

function acceptsNonEmptyStrings(_values: readonly [string, ...string[]]) {}

it('preserves the value list tuple type', () => {
  const status = makeConst([['ON', '활성'], ['OFF', '비활성']]);
  const values: ['ON', 'OFF'] = status.getList();
  acceptsNonEmptyStrings(values);

  const empty = makeConst([]);
  // @ts-expect-error 빈 목록은 비어 있지 않은 튜플에 할당할 수 없다.
  acceptsNonEmptyStrings(empty.getList());

  const dynamicItems: [string, string][] = [['ON', '활성']];
  const dynamic = makeConst(dynamicItems);
  // @ts-expect-error 일반 배열은 비어 있지 않음을 보장하지 않는다.
  acceptsNonEmptyStrings(dynamic.getList());
  expect(values).toEqual(['ON', 'OFF']);
});

describe('copy', () => {
  it('makeConst', () => {
    {
      const Status = makeConst([
        ['ON', '활성'],
        ['OFF', '비활성'],
      ]);

      expect(Status.On).toBe('ON');
      expect(Status.Off).toBe('OFF');
      expect(Status.getLabel(Status.On)).toBe('활성');
      expect(Status.getLabel(Status.Off)).toBe('비활성');
      expect(Status.getList()).toEqual(['ON', 'OFF']);
      expect(Status.getLvList()).toEqual([
        { value: 'ON', label: '활성' },
        { value: 'OFF', label: '비활성' },
      ]);
      expect(Status.getKeyList()).toEqual(['On', 'Off']);
    }

    {
      const Id = makeConst([
        [1, '일번', 'First'],
        [2, '이번', 'Second'],
        [3, '삼번', 'Third'],
      ]);

      expect(Id.First).toBe(1);
      expect(Id.Second).toBe(2);
      expect(Id.Third).toBe(3);
      expect(Id.getLabel(Id.First)).toBe('일번');
      expect(Id.getLabel(Id.Second)).toBe('이번');
      expect(Id.getLabel(Id.Third)).toBe('삼번');
      expect(Id.getList()).toEqual([1, 2, 3]);
      expect(Id.getLvList()).toEqual([
        { value: 1, label: '일번' },
        { value: 2, label: '이번' },
        { value: 3, label: '삼번' },
      ]);
      expect(Id.getKeyList()).toEqual(['First', 'Second', 'Third']);
    }
  });
});
