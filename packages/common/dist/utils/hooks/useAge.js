"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAge = void 0;
// import {useEffect, useState} from 'react';
const constants_1 = require("../constants");
const useAge = ({ useEffect, useState }, format) => {
    const [ageFormat, toggleAgeFormat] = useState(format ||
        localStorage.getItem(constants_1.LOCALSTORAGE_KEYS_MAP.ageFormat) !== 'datetime'
        ? 'age'
        : 'datetime');
    useEffect(() => {
        if (localStorage.getItem(constants_1.LOCALSTORAGE_KEYS_MAP.ageFormat) !== ageFormat) {
            localStorage.setItem(constants_1.LOCALSTORAGE_KEYS_MAP.ageFormat, ageFormat);
        }
    }, [format, ageFormat]);
    return [ageFormat, toggleAgeFormat];
};
exports.useAge = useAge;
