"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_ICONS = exports.ENV_THEME = void 0;
const arrow_btc_svg_1 = __importDefault(require("../../images/token/arrow-btc.svg"));
const baseColor = '#F7931A';
exports.ENV_THEME = {
    primary: baseColor,
    antdPrimaryButtonBg: baseColor,
    buttonBg: 'rgb(247, 147, 26, 0.8)',
    outlineColor: baseColor,
    shadowColor: 'rgb(247, 147, 26, 0.2)',
    searchButtonBg: baseColor,
    searchButtonHoverBg: '#EDA54E',
    gasPriceLineBg: '#FDF4E9',
    footerBg: '#13161E',
    footerHighLightColor: baseColor,
    linkColor: baseColor,
    linkHoverColor: baseColor,
    chartColors: [baseColor, '#36B46B', '#0D2535', '#5388D8'],
    mixedChartColors: [baseColor, '#36B46B', '#434348'],
    pieChartColors: ['#F4BE37', baseColor, '#0D2535', '#5388D8'],
    chartTitleColor: baseColor,
    chartDetailLinkColor: baseColor,
};
exports.ENV_ICONS = {
    imgArrow: arrow_btc_svg_1.default,
};
