/********************************************************************************************************************
 * Types
 * ******************************************************************************************************************/

type ValueOf<T> = T[keyof T];
type IsArray<T> = T extends unknown[] ? true : false;

/********************************************************************************************************************
 * camelCase
 * ******************************************************************************************************************/

function camelCase<T extends string>(str: T): CamelCase<T> {
  const result = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()) as CamelCase<T>;
  return (result.charAt(0).toUpperCase() + result.slice(1)) as CamelCase<T>;
}

/********************************************************************************************************************
 * MakeConst
 * ******************************************************************************************************************/

type MakeConst<T> = ValueOf<{ [K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K] }>;

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

/** MakeAliasMap */
type MakeAliasValueMap<Items extends TItems> = {
  [K in Items[number] as K extends TItem ? CamelCase<K[0]> : K extends TItemWithAlias ? K[2] : never]: K[0];
};

/** MakeValueNameMap */
type MakeValueLabelMap<Items extends TItems> = {
  [K in Items[number] as K[0]]: K[1];
};

/** MakeNameList */
type MakeNameValueList<Name extends string, Items extends TItems> = Array<
  ValueOf<{
    [K in Items[number] as K[0]]: { [V in Name]: K[0] } & { label: K[1] };
  }>
>;

/** MakeLvList */
type MakeLabelValueMap<Items extends TItems> = Items extends readonly (infer Item)[]
  ? Item extends readonly [infer V, infer N, any?]
    ? { value: V; label: N }
    : never
  : never;

/********************************************************************************************************************
 * makeConst
 * ******************************************************************************************************************/

function _makeConst<
  Name extends string,
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
  NameValueList = MakeNameValueList<Name, Items>,
  LabelValueMap = MakeLabelValueMap<Items>,
  ValueType = Items[number][0],
  GetLabel = <T extends keyof ValueLabelMap>(value: T) => ValueLabelMap[T],
  GetList = (copy?: boolean) => ValueList,
  GetNvList = () => NameValueList,
  GetLvList = <
    LvValue extends string | number,
    LvLabel extends string,
    LvItems extends readonly { value: LvValue; label: LvLabel }[],
  >(
    items?: LvItems
  ) => [...ReadonlyArray<LabelValueMap>, ...(IsArray<LvItems> extends true ? LvItems : [])],
  Result = AliasValueMap & {
    Type: ValueType;
    getLabel: GetLabel;
    getList: GetList;
    getNvList: GetNvList;
    getLvList: GetLvList;
  },
>(name: Name, items: Items): Result {
  const aliasValueMap = items.reduce(
    (acc, item) => {
      if (item.length === 3) {
        const [value, , alias] = item;
        acc[alias] = value;
        return acc;
      } else {
        const [value] = item;
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

  const list = items.map((item) => item[0]);

  const nvList = items.map((item) => ({ [name]: item[0], name: item[1] }));

  const lvList = items.map((item) => ({ value: item[0], label: item[1] }));

  return {
    ...aliasValueMap,

    getLabel(value: any) {
      return valueLabelMap[value];
    },

    getList(copy = false) {
      return copy ? [...list] : list;
    },

    getNvList() {
      return nvList.map((item) => ({ ...item }));
    },

    getLvList(extraPreItems?: any[]) {
      return [...(extraPreItems || []), ...lvList];
    },
  } as Result;
}

/********************************************************************************************************************
 * getLvList
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
  LabelValueMap = MakeLabelValueMap<Items>,
  ValueType = Items[number][0],
  GetLabel = <T extends keyof ValueLabelMap>(value: T) => ValueLabelMap[T],
  GetList = (copy?: boolean) => ValueList,
  GetLvList = <
    LvValue extends string | number,
    LvLabel extends string,
    LvItems extends readonly { value: LvValue; label: LvLabel }[],
  >(
    items?: LvItems
  ) => [...ReadonlyArray<LabelValueMap>, ...(IsArray<LvItems> extends true ? LvItems : [])],
  Result = AliasValueMap & {
    Type: ValueType;
    getLabel: GetLabel;
    getList: GetList;
    getLvList: GetLvList;
  },
>(items: Items): Result;

function makeConst<
  Name extends string,
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
  NameValueList = MakeNameValueList<Name, Items>,
  LabelValueMap = MakeLabelValueMap<Items>,
  ValueType = Items[number][0],
  GetLabel = <T extends keyof ValueLabelMap>(value: T) => ValueLabelMap[T],
  GetList = (copy?: boolean) => ValueList,
  GetNvList = () => NameValueList,
  GetLvList = <
    LvValue extends string | number,
    LvLabel extends string,
    LvItems extends readonly { value: LvValue; label: LvLabel }[],
  >(
    items?: LvItems
  ) => [...ReadonlyArray<LabelValueMap>, ...(IsArray<LvItems> extends true ? LvItems : [])],
  Result = AliasValueMap & {
    Type: ValueType;
    getLabel: GetLabel;
    getList: GetList;
    getNvList: GetNvList;
    getLvList: GetLvList;
  },
>(name: Name, items: Items): Result;

function makeConst(nameOrItems: any, itemsOrUndefined?: any) {
  if (itemsOrUndefined === undefined) {
    const constObj = _makeConst('Unknown', nameOrItems);
    type ConstType = MakeConst<typeof constObj>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { getNvList, ...others } = constObj;
    return {
      ...others,
      Type: null as unknown as ConstType,
    };
  } else {
    const constObj = _makeConst(nameOrItems, itemsOrUndefined);
    type ConstType = MakeConst<typeof constObj>;
    return {
      ...constObj,
      Type: null as unknown as ConstType,
    };
  }
}

export { makeConst };

export default makeConst;
