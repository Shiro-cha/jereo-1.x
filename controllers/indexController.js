"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = require("fs");
var process_1 = require("process");
var child_process_1 = __importDefault(require("child_process"));
var path_1 = require("path");
var Jereo = (function () {
    function Jereo() {
        this.path = "";
    }
    Jereo.prototype.watchOnly = function (pathFileOrDirectory, options) {
        Jereo.isProcessing = false;
        this.path = !(0, path_1.isAbsolute)(pathFileOrDirectory) ? (0, path_1.join)((0, process_1.cwd)(), pathFileOrDirectory) : pathFileOrDirectory;
        if ((0, fs_1.existsSync)(this.path) && (0, fs_1.statSync)(this.path).isDirectory()) {
            var myDir_1 = this.path;
            var typeDirectory_1 = undefined;
            if (options.hasOwnProperty("directory") && !options.hasOwnProperty("file")) {
                typeDirectory_1 = true;
            }
            else if (options.hasOwnProperty("file") && !options.hasOwnProperty("directory")) {
                typeDirectory_1 = false;
            }
            else {
                typeDirectory_1 = undefined;
            }
            (0, fs_1.readdir)(this.path, function (err, listes) {
                listes.forEach(function (liste) {
                    var myTempFile = (0, path_1.join)(myDir_1, liste);
                    var typeVerification = typeDirectory_1 ? (0, fs_1.statSync)(myTempFile).isDirectory() : (0, fs_1.statSync)(myTempFile).isFile();
                    if (typeVerification) {
                        new Promise(function (success, reject) {
                            typeDirectory_1 ? (0, fs_1.watch)(myTempFile, function (evt, filename) {
                                if (Boolean(evt) && Boolean(filename)) {
                                    if (options.hasOwnProperty("Exec")) {
                                        Jereo.execute(options["Exec"], myTempFile, filename, function () {
                                            console.log("Watch on: ".concat(myDir_1, " ..."));
                                        });
                                    }
                                }
                            }) : (0, fs_1.watchFile)(myTempFile, function () {
                                if (options.hasOwnProperty("Exec")) {
                                    Jereo.execute(options["Exec"], myTempFile, myTempFile, function () {
                                        console.log("Watch on: ".concat(myDir_1, " ..."));
                                    });
                                }
                            });
                            success();
                        }).then(function () {
                        });
                    }
                });
                console.log("Watch on: ".concat(myDir_1, " ..."));
            });
        }
        else {
            console.error(new Error("The path doesn't exist...").message);
        }
    };
    Jereo.prototype.watchRecurvely = function (pathFileOrDirectory, options) {
        console.log("recursively");
    };
    Jereo.execute = function (options, myTempFile, filename, callback) {
        if (options.length > 0) {
            var tempPatternList_1 = options;
            tempPatternList_1.forEach(function (item, i) {
                if (item.includes(" ")) {
                    var tempArray = item.split("");
                    tempArray.unshift("\"");
                    tempArray.push("\"");
                    tempPatternList_1[i] = tempArray.join("");
                }
                if (item === "::") {
                    tempPatternList_1[i] = (0, path_1.join)(myTempFile, filename);
                }
                if (item.toLowerCase() === "and") {
                    tempPatternList_1[i] = "&&";
                }
                if (item.toLowerCase() === "or") {
                    tempPatternList_1[i] = "|";
                }
                if (item.includes("+") && item.indexOf("+") === 0) {
                    tempPatternList_1[i] = item.split('+').join('-');
                }
            });
            var tempPatternString = tempPatternList_1.join(" ");
            try {
                if (!Jereo.isProcessing) {
                    var processTemp = null;
                    processTemp = child_process_1["default"].exec(tempPatternString);
                    console.log("\nwaiting...\n");
                    Jereo.isProcessing = true;
                    if (Boolean(processTemp)) {
                        processTemp.stdout.on("data", function (data) {
                            console.log(data);
                        });
                        processTemp.stderr.on("data", function (data) {
                            console.log(data);
                        });
                        processTemp.on("close", function (code) {
                            Jereo.isProcessing = false;
                            if (code === 0) {
                                console.log("Finish...Ok");
                            }
                            else {
                                console.log("Finish with error");
                            }
                            callback();
                        });
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    Jereo.isProcessing = false;
    return Jereo;
}());
exports["default"] = new Jereo();
