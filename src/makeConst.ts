/********************************************************************************************************************
 * Types
 * ******************************************************************************************************************/

type Writable<T> = { -readonly [P in keyof T]: T[P] };
type IsArray<T> = T extends unknown[] ? true : false;

/********************************************************************************************************************
 * camelCase
 * ******************************************************************************************************************/

function camelCase<T extends string>(str: T): CamelCase<T> {
  const result = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()) as CamelCase<T>;
  return (result.charAt(0).toUpperCase() + result.slice(1)) as CamelCase<T>;
}

/********************************************************************************************************************
 * Types
 * ******************************************************************************************************************/

type CamelCase<S extends PropertyKey> = S extends string
  ? S extends `${infer T}_${infer U}`
    ? `${Capitalize<Lowercase<T>>}${CamelCase<U>}`
    : Capitalize<Lowercase<S>>
  : S;

type TItem = readonly [string, any];
type TItemWithAlias = readonly [string | number, any, string];
type TItems = readonly TItem[] | readonly TItemWithAlias[];

/** MakeAliasValueMap */
type MakeAliasValueMap<Items extends TItems> = {
  [K in Items[number] as K extends TItem ? CamelCase<K[0]> : K extends TItemWithAlias ? K[2] : never]: K[0];
};

/** MakeValueLabelMap */
type MakeValueLabelMap<Items extends TItems> = {
  [K in Items[number] as K[0]]: K[1];
};

/** MakeLvList */
type MakeLvList<Items extends TItems> = {
  [K in keyof Items]: Items[K] extends readonly [infer V, infer L, ...any[]] ? { value: V; label: L } : never;
};

/********************************************************************************************************************
 * makeConst
 * ******************************************************************************************************************/

function makeConst<
  StringValue extends string,
  NumberValue extends number,
  Label extends string,
  Alias extends string,
  const Items extends
    | readonly (readonly [StringValue, Label])[]
    | readonly (readonly [StringValue | NumberValue, Label, Alias])[],
  AliasValueMap = MakeAliasValueMap<Items>,
  ValueLabelMap = MakeValueLabelMap<Items>,
  ValueList = Items[number][0][],
  ValueLabelList = MakeLvList<Items>,
  ValueType = Items[number][0],
  GetLabel = <T extends keyof ValueLabelMap>(value: T) => ValueLabelMap[T],
  GetList = () => ValueList,
  GetLvList = <
    LvValue extends string | number,
    LvLabel extends string,
    LvItems extends readonly { value: LvValue; label: LvLabel }[],
  >(
    items?: LvItems
  ) => Writable<
    [
      ...(ValueLabelList extends readonly any[] ? ValueLabelList : []),
      ...(IsArray<LvItems> extends true ? LvItems : []),
    ]
  >,
  GetKeyList = () => {
    [K in keyof Items]: Items[K] extends TItem
      ? CamelCase<Items[K][0]>
      : Items[K] extends TItemWithAlias
        ? Items[K][2]
        : never;
  },
  Result = AliasValueMap & {
    Type: ValueType;
    getLabel: GetLabel;
    getList: GetList;
    getLvList: GetLvList;
    getKeyList: GetKeyList;
  },
>(items: Items): Result {
  const aliasValueMap = items.reduce(
    (acc, [value, , alias]) => {
      if (alias !== undefined) {
        acc[alias] = value;
        return acc;
      } else if (typeof value === 'string') {
        const alias = camelCase(value);
        acc[alias] = value;
      }
      return acc;
    },
    {} as Record<string, any>
  );

  const valueLabelMap = items.reduce(
    (acc, [value, label]) => {
      acc[value] = label;
      return acc;
    },
    {} as Record<any, string>
  );

  return {
    ...aliasValueMap,

    Type: undefined as unknown as ValueType,

    getLabel(value: any) {
      return valueLabelMap[value];
    },

    getList() {
      return items.map((item) => item[0]);
    },

    getLvList(extraPreItems?: any[]) {
      return [...(extraPreItems || []), ...items.map((item) => ({ value: item[0], label: item[1] }))];
    },

    getKeyList() {
      return Object.keys(aliasValueMap);
    },
  } as Result;
}

export { makeConst };

export default makeConst;
