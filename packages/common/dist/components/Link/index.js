"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
exports.Link = react_1.default.memo(({ className, href, ga, children, state, ...others }) => {
    const history = (0, react_router_dom_1.useHistory)();
    const handleClick = (e) => {
        e.preventDefault();
        if (!href)
            return;
        if (/^http/.test(href)) {
            window.open(href, '_blank', 'noopener,noreferrer');
        }
        else if (e.metaKey || e.ctrlKey) {
            window.open(`${window.location.origin}${href}`, '_blank');
        }
        else {
            history.push({
                pathname: href,
                state: state,
            });
        }
    };
    if (/^http/.test(href)) {
        return ((0, jsx_runtime_1.jsx)("a", { className: className, href: href, onClick: handleClick, ...others, children: children }));
    }
    else {
        return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { className: className, to: {
                pathname: href,
                state: state
            }, onClick: handleClick, ...others, children: children }));
    }
});
