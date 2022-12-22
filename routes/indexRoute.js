"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var indexController_1 = __importDefault(require("../controllers/indexController"));
var process_1 = require("process");
function default_1(argument, options) {
    if (argument === void 0) { argument = (0, process_1.cwd)(); }
    if (options.hasOwnProperty("recursive")) {
        indexController_1["default"].watchRecurvely(argument, options);
    }
    else {
        indexController_1["default"].watchOnly(argument, options);
    }
}
exports["default"] = default_1;
