"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAge = void 0;
const react_1 = require("react");
const constants_1 = require("../constants");
const useAge = (format) => {
    const [ageFormat, toggleAgeFormat] = (0, react_1.useState)(format ||
        localStorage.getItem(constants_1.LOCALSTORAGE_KEYS_MAP.ageFormat) !== 'datetime'
        ? 'age'
        : 'datetime');
    (0, react_1.useEffect)(() => {
        if (localStorage.getItem(constants_1.LOCALSTORAGE_KEYS_MAP.ageFormat) !== ageFormat) {
            localStorage.setItem(constants_1.LOCALSTORAGE_KEYS_MAP.ageFormat, ageFormat);
        }
    }, [format, ageFormat]);
    return [ageFormat, toggleAgeFormat];
};
exports.useAge = useAge;
