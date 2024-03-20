"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionButton = exports.IconButton = exports.BaseButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const BaseButton_1 = require("./BaseButton");
const IconButton_1 = require("./IconButton");
const ActionButton_1 = require("./ActionButton");
const ComponentMap = {
    default: BaseButton_1.BaseButton,
    icon: IconButton_1.IconButton,
    action: ActionButton_1.ActionButton,
};
const Button = (0, react_1.forwardRef)(({ type = "default", ...props }, ref) => {
    const Component = ComponentMap[type];
    return ((0, jsx_runtime_1.jsx)(Component, { ref: ref, ...props }));
});
exports.default = Button;
var BaseButton_2 = require("./BaseButton");
Object.defineProperty(exports, "BaseButton", { enumerable: true, get: function () { return BaseButton_2.BaseButton; } });
var IconButton_2 = require("./IconButton");
Object.defineProperty(exports, "IconButton", { enumerable: true, get: function () { return IconButton_2.IconButton; } });
var ActionButton_2 = require("./ActionButton");
Object.defineProperty(exports, "ActionButton", { enumerable: true, get: function () { return ActionButton_2.ActionButton; } });
