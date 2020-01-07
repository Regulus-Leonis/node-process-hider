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

/**
 * @name formatDate
 * @description 格式化日期
 * @param {Date} date 
 * @param {String} fmt 
 */
function formatDate(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

module.exports = {
  setDefine,
  formatDate
};
