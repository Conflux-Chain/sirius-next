"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequest = void 0;
const qs_1 = __importDefault(require("qs"));
const sendRequest = async (config) => {
    const response = await fetch(`${config.url}?${qs_1.default.stringify(config.query)}`, {
        method: config.type || 'GET',
        body: config.body,
        headers: config.headers,
        signal: config.signal,
    });
    return response.json();
};
exports.sendRequest = sendRequest;
