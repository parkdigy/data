/********************************************************************************************************************
 * Types
 * ******************************************************************************************************************/
type ValueOf<T> = T[keyof T];
type IsArray<T> = T extends unknown[] ? true : false;
/********************************************************************************************************************
 * Types
 * ******************************************************************************************************************/
type CamelCase<S extends PropertyKey> = S extends string ? S extends `${infer T}_${infer U}` ? `${Capitalize<Lowercase<T>>}${CamelCase<U>}` : Capitalize<Lowercase<S>> : S;
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
type MakeNameValueList<Name extends string, Items extends TItems> = Array<ValueOf<{
    [K in Items[number] as K[0]]: {
        [V in Name]: K[0];
    } & {
        label: K[1];
    };
}>>;
/** MakeLvList */
type MakeLabelValueMap<Items extends TItems> = Items extends readonly (infer Item)[] ? Item extends readonly [infer V, infer N, any?] ? {
    value: V;
    label: N;
} : never : never;
/********************************************************************************************************************
 * getLvList
 * ******************************************************************************************************************/
declare function makeConst<StringValue extends string, NumberValue extends number, Label extends string, Alias extends string, const Items extends readonly (readonly [StringValue, Label])[] | readonly (readonly [StringValue | NumberValue, Label, Alias])[], AliasValueMap = MakeAliasValueMap<Items>, ValueLabelMap = MakeValueLabelMap<Items>, ValueList = Items[number][0][], LabelValueMap = MakeLabelValueMap<Items>, ValueType = Items[number][0], GetLabel = <T extends keyof ValueLabelMap>(value: T) => ValueLabelMap[T], GetList = () => ValueList, GetLvList = <LvValue extends string | number, LvLabel extends string, LvItems extends readonly {
    value: LvValue;
    label: LvLabel;
}[]>(items?: LvItems) => [...ReadonlyArray<LabelValueMap>, ...(IsArray<LvItems> extends true ? LvItems : [])], Result = AliasValueMap & {
    Type: ValueType;
    getLabel: GetLabel;
    getList: GetList;
    getLvList: GetLvList;
}>(items: Items): Result;
declare function makeConst<Name extends string, StringValue extends string, NumberValue extends number, Label extends string, Alias extends string, const Items extends readonly (readonly [StringValue, Label])[] | readonly (readonly [StringValue | NumberValue, Label, Alias])[], AliasValueMap = MakeAliasValueMap<Items>, ValueLabelMap = MakeValueLabelMap<Items>, ValueList = Items[number][0][], NameValueList = MakeNameValueList<Name, Items>, LabelValueMap = MakeLabelValueMap<Items>, ValueType = Items[number][0], GetLabel = <T extends keyof ValueLabelMap>(value: T) => ValueLabelMap[T], GetList = () => ValueList, GetNvList = () => NameValueList, GetLvList = <LvValue extends string | number, LvLabel extends string, LvItems extends readonly {
    value: LvValue;
    label: LvLabel;
}[]>(items?: LvItems) => [...ReadonlyArray<LabelValueMap>, ...(IsArray<LvItems> extends true ? LvItems : [])], Result = AliasValueMap & {
    Type: ValueType;
    getLabel: GetLabel;
    getList: GetList;
    getNvList: GetNvList;
    getLvList: GetLvList;
}>(name: Name, items: Items): Result;
export { makeConst };
export default makeConst;
