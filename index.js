const { configue, compile, install, uninstall } = require("./src/core");

/**
 * @name setHideProcess
 * @description Hide process.
 * @param {Array} processFilters 
 */
function setHideProcess(processFilters) {
  configue(processFilters);
  compile();
  install();
}

/**
 * @name clean
 * @description Uninstall lib module and cache file.
 */
function clean() {
  uninstall();
}

module.exports = {
  setHideProcess,
  clean
}