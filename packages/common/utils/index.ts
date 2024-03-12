export const toThousands = (num: number | string, delimiter = ",", prevDelimiter = ",") => {
  if ((typeof num !== "number" || isNaN(num)) && typeof num !== "string")
    return "";
  let str = num + "";
  return str
    .replace(new RegExp(prevDelimiter, "igm"), "")
    .split(".")
    .reduce((acc, cur, index) => {
      if (index) {
        return `${acc}.${cur}`;
      } else {
        return cur.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, `$1${delimiter}`);
      }
    }, "");
};
