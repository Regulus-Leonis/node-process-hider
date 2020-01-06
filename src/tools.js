/**
 * @name formatDefineVariable
 * @description 格式化宏变量字符串
 * @param {*} value
 * @returns {String}
 */
function formatDefineVariable(value) {
  if (Object.prototype.toString.call(value) === "[object String]") {
    return `"${value}"`;
  } else if (Object.prototype.toString.call(value) === "[object Number]") {
    return value.toString();
  } else if (Object.prototype.toString.call(value) === "[object Array]") {
    const tmpStr = value.map(item => formatDefineVariable(item));
    return `{${tmpStr.join(",")}}`;
  } else {
    return "";
  }
}

/**
 * @name setDefine
 * @description 正则替换宏变量字符串
 * @param {String} str 待替换的文件内容
 * @param {String} key 变量名
 * @param {*} value 变量值
 * @returns {String}
 */
function setDefine(str, key, value) {
  const pattern = `#define\ ${key}\ .*`;
  const replaceStr = `#define ${key} ${formatDefineVariable(value)}`;
  const regexp = new RegExp(pattern, "gi");
  return str.replace(regexp, replaceStr);
}

module.exports = {
  setDefine
};
