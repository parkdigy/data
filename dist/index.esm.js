/********************************************************************************************************************
 * 객체 복사
 * @param value 복사할 객체
 * @returns 복사된 객체
 * ******************************************************************************************************************/
function copy(value) {
    return JSON.parse(JSON.stringify(value));
}/********************************************************************************************************************
 * 구현
 * ******************************************************************************************************************/
function lv(label, value, other) {
    return Object.assign(Object.assign({}, other), { label, value });
}/********************************************************************************************************************
 * 구현
 * ******************************************************************************************************************/
function vl(value, label, other) {
    return Object.assign(Object.assign({}, other), { value, label });
}/********************************************************************************************************************
 * Types
 * ******************************************************************************************************************/
/********************************************************************************************************************
 * camelCase
 * ******************************************************************************************************************/
function camelCase(str) {
    const result = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    return (result.charAt(0).toUpperCase() + result.slice(1));
}
/********************************************************************************************************************
 * makeConst
 * ******************************************************************************************************************/
function makeConst(items) {
    const aliasValueMap = items.reduce((acc, [value, , alias]) => {
        if (alias !== undefined) {
            acc[alias] = value;
            return acc;
        }
        else if (typeof value === 'string') {
            const alias = camelCase(value);
            acc[alias] = value;
        }
        return acc;
    }, {});
    const valueLabelMap = items.reduce((acc, [value, label]) => {
        acc[value] = label;
        return acc;
    }, {});
    return Object.assign(Object.assign({}, aliasValueMap), { Type: undefined, getLabel(value) {
            return valueLabelMap[value];
        },
        getList() {
            return items.map((item) => item[0]);
        },
        getLvList(extraPreItems) {
            return [...(extraPreItems || []), ...items.map((item) => ({ value: item[0], label: item[1] }))];
        } });
}var index = {
    copy,
    lv,
    vl,
    makeConst,
};export{copy,index as default,lv,makeConst,vl};