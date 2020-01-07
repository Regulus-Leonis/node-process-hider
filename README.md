# node-process-hider

A nodejs cli tool for hiding linux process.

## Precondition 

1. Linux only
2. Make sure you have sudo privileges
3. GCC compiler

You can install gcc by typing:

```bash
# Debian
$ sudo apt install gcc

# Redhat
$ sudo yum install gcc
```

## Usage

### Install

```bash
$ npm i -g node-process-hider
```

### Hide process

For example, i want to hide process `ssserver`.

```bash
[root@rp ~]# ps -ef | grep ssserver | grep -v grep
root  1582  1581  0 Jan06 ?  00:00:00 /usr/bin/python2 /usr/bin/ssserver -c /etc/shadowsocks.json
root  1607  1582  0 Jan06 ?  00:00:01 /usr/bin/python2 /usr/bin/ssserver -c /etc/shadowsocks.json
root  1608  1582  0 Jan06 ?  00:00:02 /usr/bin/python2 /usr/bin/ssserver -c /etc/shadowsocks.json
root  1609  1582  0 Jan06 ?  00:00:02 /usr/bin/python2 /usr/bin/ssserver -c /etc/shadowsocks.json
root  1610  1582  0 Jan06 ?  00:00:02 /usr/bin/python2 /usr/bin/ssserver -c /etc/shadowsocks.json
```

If you are not sure of the process name. You can use the following command to get process name by pid.

```bash
[root@rp ~]# ps -p 1582 -o comm=
ssserver
```

Hide process.

```bash
[root@rp ~]# sudo ph add ssserver
___  ____ ____ ____ ____ ____ ____ _  _ _ ___  ____ ____
|__] |__/ |  | |    |___ [__  [__  |__| | |  \ |___ |__/
|    |  \ |__| |___ |___ ___] ___] |  | | |__/ |___ |  \
---------------------------------------------------------

╔════╤══════════╤═════════════════════╗
║ ID │ FILTER   │ UPTIME              ║
╟────┼──────────┼─────────────────────╢
║ 0  │ ssserver │ 2020-01-07 10:51:26 ║
╚════╧══════════╧═════════════════════╝
```

Now you can find this process is hidden.

```bash
[root@rp ~]# ps -ef | grep ssserver | grep -v grep
```

### Show process

If you don't want the process to be hidden any more, you can use the following command.

```bash
[root@rp ~]# sudo ph delete 0
___  ____ ____ ____ ____ ____ ____ _  _ _ ___  ____ ____
|__] |__/ |  | |    |___ [__  [__  |__| | |  \ |___ |__/
|    |  \ |__| |___ |___ ___] ___] |  | | |__/ |___ |  \
---------------------------------------------------------

╔════╤════════╤════════╗
║ ID │ FILTER │ UPTIME ║
╚════╧════════╧════════╝
```

Check!

```bash
[root@rp ~]# ps -ef | grep ssserver | grep -v grep
root  1582  1581  0 Jan06 ?  00:00:00 /usr/bin/python2 /usr/bin/ssserver -c /etc/shadowsocks.json
root  1607  1582  0 Jan06 ?  00:00:01 /usr/bin/python2 /usr/bin/ssserver -c /etc/shadowsocks.json
root  1608  1582  0 Jan06 ?  00:00:02 /usr/bin/python2 /usr/bin/ssserver -c /etc/shadowsocks.json
root  1609  1582  0 Jan06 ?  00:00:02 /usr/bin/python2 /usr/bin/ssserver -c /etc/shadowsocks.json
root  1610  1582  0 Jan06 ?  00:00:02 /usr/bin/python2 /usr/bin/ssserver -c /etc/shadowsocks.json
```

## Full features 

I will gradually complete the document. Please create an [Issue](https://github.com/Vincent0700/node-process-hider/issues) if you have problems when using this tool.

```bash
[root@rp ~]# ph -h
___  ____ ____ ____ ____ ____ ____ _  _ _ ___  ____ ____
|__] |__/ |  | |    |___ [__  [__  |__| | |  \ |___ |__/
|    |  \ |__| |___ |___ ___] ___] |  | | |__/ |___ |  \
---------------------------------------------------------

Usage: ph [options] [command]

A nodejs module to hide linux process.

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  list           list process filters
  add <name>     add filter by process name
  delete <id>    delete filter by id
  logs <id>      show ps info when created filter
  clean          uinstall lib module and cache file
```

## How it works

I have explained the principle of process hidden at the following article. [ReadMore](https://vincentstudio.info/2019/05/19/030_How_to_Hide_Linux_Process/)
