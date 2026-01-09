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
}/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};/********************************************************************************************************************
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
function _makeConst(name, items) {
    const aliasValueMap = items.reduce((acc, item) => {
        if (item.length === 3) {
            const [value, , alias] = item;
            acc[alias] = value;
            return acc;
        }
        else {
            const [value] = item;
            const alias = camelCase(value);
            acc[alias] = value;
        }
        return acc;
    }, {});
    const valueLabelMap = items.reduce((acc, [value, label]) => {
        acc[value] = label;
        return acc;
    }, {});
    const list = items.map((item) => item[0]);
    const nvList = items.map((item) => ({ [name]: item[0], name: item[1] }));
    const lvList = items.map((item) => ({ value: item[0], label: item[1] }));
    return Object.assign(Object.assign({}, aliasValueMap), { getLabel(value) {
            return valueLabelMap[value];
        },
        getList(copy = false) {
            return copy ? [...list] : list;
        },
        getNvList() {
            return nvList.map((item) => (Object.assign({}, item)));
        },
        getLvList(extraPreItems) {
            return [...(extraPreItems || []), ...lvList];
        } });
}
function makeConst(nameOrItems, itemsOrUndefined) {
    if (itemsOrUndefined === undefined) {
        const constObj = _makeConst('Unknown', nameOrItems);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { getNvList } = constObj, others = __rest(constObj, ["getNvList"]);
        return Object.assign(Object.assign({}, others), { Type: null });
    }
    else {
        const constObj = _makeConst(nameOrItems, itemsOrUndefined);
        return Object.assign(Object.assign({}, constObj), { Type: null });
    }
}var index = {
    copy,
    lv,
    vl,
    makeConst,
};export{copy,index as default,lv,makeConst,vl};