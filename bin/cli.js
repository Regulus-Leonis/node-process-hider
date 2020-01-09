#!/usr/bin/env node

require("colors");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const cmd = require("commander");
const jf = require("jsonfile");
const Table = require("cli-table");
const { showHeader } = require("./header");
const { formatDate } = require("../src/tools");
const { setHideProcess, clean } = require("../index");

const projectDir = path.resolve(__dirname, "../");
const packageFilePath = path.resolve(projectDir, "./package.json");
const dumpFilePath = path.resolve(projectDir, "./.dump.json");
const package = jf.readFileSync(packageFilePath);

const MAX_CMD_LENGHT = 80;
const DUMP_JSON_SPACES = 2;

let cache = { filters: [] };

function saveCache() {
  jf.writeFileSync(dumpFilePath, cache, { spaces: DUMP_JSON_SPACES });
}

function createTable() {
  return new Table({
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│"
    }
  });
}

try {
  const data = jf.readFileSync(dumpFilePath);
  if (!data.filters || !Array.isArray(data.filters)) {
    saveCache();
  } else {
    cache = data;
  }
} catch (err) {
  saveCache();
}

cmd.version(package.version);
cmd.description(package.description);

cmd
  .command("list")
  .description("list process filters")
  .action(() => {
    const table = createTable();
    table.push(
      ["ID", "FILTER", "UPTIME"].map(item => item.brightCyan.bold),
      ...cache.filters.map((item, index) => [
        index.toString(),
        item.name,
        item.uptime
      ])
    );
    console.log(table.toString());
  });

cmd
  .command("add [name]")
  .description("add filter by process name")
  .action(processName => {
    let isRepeated = false;
    for (let item of cache.filters) {
      if (item.name === processName) {
        isRepeated = true;
        console.log(`[WARN] Process <${processName}> has already been added.`);
        break;
      }
    }
    if (!isRepeated) {
      let stdout = shell.exec(
        `ps -ef | grep "${processName}" | grep -v grep | grep -v 'ph add'`,
        { silent: true }
      ).stdout;
      let logs = [];
      stdout.split("\n").forEach(item => {
        const data = item.trim().replace(/\ +/g, " ");
        const splitData = data.split(" ");
        if (splitData && splitData.length > 7) {
          logs.push({
            UID: splitData[0],
            PID: splitData[1],
            PPID: splitData[2],
            CPU: splitData[3],
            STIME: splitData[4],
            TTY: splitData[5],
            TIME: splitData[6],
            CMD: data.split(splitData[6])[1].trim()
          });
        }
      });
      cache.filters.push({
        name: processName,
        uptime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
        logs
      });
      setHideProcess(cache.filters.map(item => item.name));
      saveCache();

      const table = createTable();
      table.push(
        ["ID", "FILTER", "UPTIME"].map(item => item.brightCyan.bold),
        ...cache.filters.map((item, index) => [
          index.toString(),
          item.name,
          item.uptime
        ])
      );
      console.log(table.toString());
    }
  });

cmd
  .command("delete [id]")
  .description("delete filter by id")
  .action(id => {
    const index = parseInt(id);

    if (!cache.filters[index]) {
      console.log(`Cannot find process fillter where id is ${id}.`);
      return;
    }

    cache.filters.splice(index, 1);
    setHideProcess(cache.filters.map(item => item.name));
    saveCache();

    const table = createTable();
    table.push(
      ["ID", "FILTER", "UPTIME"].map(item => item.brightMagenta),
      ...cache.filters.map((item, index) => [
        index.toString(),
        item.name,
        item.uptime
      ])
    );
    console.log(table.toString());
  });

cmd
  .command("logs [id]")
  .description("show ps info when created filter")
  .action(id => {
    const index = parseInt(id);
    const table = createTable();

    if (!cache.filters[index]) {
      console.log(`Cannot find process fillter where id is ${id}.`);
      return;
    }

    table.push(
      ["PID", "UID", "CPU", "TTY", "CMD"].map(item => item.brightCyan.bold),
      ...cache.filters[index].logs.map(item => [
        item.PID,
        item.UID,
        item.CPU,
        item.TTY,
        item.CMD.length <= MAX_CMD_LENGHT
          ? item.CMD
          : item.CMD.substring(0, MAX_CMD_LENGHT - 3) + "..."
      ])
    );
    console.log(table.toString());
  });

cmd
  .command("clean")
  .description("uinstall lib module and cache file")
  .action(() => {
    clean();
  });

showHeader(package.version);
cmd.parse(process.argv);
