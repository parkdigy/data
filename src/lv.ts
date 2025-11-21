/********************************************************************************************************************
 * {label, value, ...other} 객체 생성하여 반환하는 함수
 * @param label - label
 * @param value - value
 * @param other - 기타 속성
 * @returns 생성된 객체
 * ******************************************************************************************************************/
export function lv<L, const V, Other extends { [key: string]: unknown }>(
  label: L,
  value: V,
  other?: Other
): { label: L; value: V } & Other {
  return { label, value, ...other } as any;
}

export default lv;
