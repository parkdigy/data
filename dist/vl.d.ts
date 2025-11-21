/********************************************************************************************************************
 * {value, label, ...other} 객체 생성하여 반환하는 함수
 * @param value - value
 * @param label - label
 * @param other - 기타 속성
 * @returns 생성된 객체
 * ******************************************************************************************************************/
export declare function vl<const V, L, Other extends {
    [key: string]: unknown;
}>(value: V, label: L, other?: Other): {
    value: V;
    label: L;
} & Other;
export default vl;
