#!/bin/nodejs
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var package_json_1 = require("./package.json");
var commander_1 = require("commander");
var indexRoute_1 = __importDefault(require("./routes/indexRoute"));
commander_1.program.name("jereo")
    .description("Command line tool to whatch file and do something funny")
    .version(package_json_1.version)
    .option("-r | --recursive", "To specify if the watch will be do recursively")
    .option("-d | --directory", "To watch on directory")
    .option("-f | --file", "To watch only file")
    .option("-n | --not <file-pattern>", "To not include file(s) in the event")
    .argument("[path]", "Path to the folder or file to watch")
    .option("-exec <pattern...>", "To execute a commande for each changed in the folder or (file)\n Example: -exec ls :: (Where \"::\" is the current file/folder)")
    .action(indexRoute_1["default"]);
commander_1.program.parse();
