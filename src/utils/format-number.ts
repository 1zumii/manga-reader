/**
 *
 * @param n number need to format
 * @param digit result total digits
 *
 * @example
 * ```js
 * const result = formatNumber(1, 3)
 * result -> '001'
 * ```
 *
 * @example
 * ```js
 * const result = formatNumber(1234, 3)
 * result -> '1234'
 * ```
 */
const formatNumber = (n: number, digit: number): string => {
  if (n.toString().length > digit) {
    return n.toString();
  }
  const difference = digit - n.toString().length;
  return `${"0".repeat(difference)}${n}`;
};

export default formatNumber;
