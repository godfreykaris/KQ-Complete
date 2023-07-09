"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var client_1 = require("react-dom/client");
var App = function () {
    return (react_1.default.createElement("b", null,
        react_1.default.createElement("h1", null, "Laravel SPA Wow"),
        react_1.default.createElement("hr", null)));
};
var rootElement = document.getElementById('app');
if (rootElement) {
    var root = (0, client_1.createRoot)(rootElement);
    root.render(react_1.default.createElement(App, null));
}
