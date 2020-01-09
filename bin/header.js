require("colors");
const fs = require("fs");
const path = require("path");

const COLOR_LOGO = s => s.brightMagenta;
const COLOR_VERSION = s => s.brightYellow;

function showHeader(version) {
  const logoStr = fs.readFileSync(
    path.resolve(__dirname, "./logo.txt"),
    "utf8"
  );

  let out = "";
  out += COLOR_LOGO(logoStr);
  out += "  ";
  out += COLOR_VERSION(`v${version}`);
  out += "\n";
  console.log(out);
}

module.exports = {
  showHeader
};
