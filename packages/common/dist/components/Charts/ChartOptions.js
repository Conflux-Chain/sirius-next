"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const store_1 = require("../../store");
const config_1 = require("./config");
const ChartOptions = ({ intervalScope, intervalType, limit, onCombination }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { translations } = (0, store_1.useI18n)();
    const intervalScopeDefault = intervalScope || { day: config_1.scope.day };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex relative z-2 top-[10px] mb-[20px] left-[40px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: 'flex gap-[3px] mr-[20px]', children: [(0, jsx_runtime_1.jsxs)("div", { children: [t(translations.highcharts.options.time), ":"] }), Object.keys(intervalScopeDefault).map((e, i) => {
                        const scopeItemArray = intervalScopeDefault[e];
                        const lastScopeItem = scopeItemArray?.[scopeItemArray.length - 1];
                        const lastItemLimit = lastScopeItem?.limit;
                        return ((0, jsx_runtime_1.jsx)("div", { className: `${intervalType === e ? 'bg-[#E6EBF5]' : 'bg-[#F7F7F7]'} w-fit px-[7px] py-[2px] rounded-[5px] text-[12px] cursor-pointer hover:bg-[#eee]`, onClick: () => onCombination(e, lastItemLimit + ''), children: e }, 'scopeKey' + i));
                    })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-[3px]", children: [(0, jsx_runtime_1.jsxs)("div", { children: [t(translations.highcharts.options.range), ":"] }), intervalScopeDefault[intervalType]?.map((e, i) => ((0, jsx_runtime_1.jsx)("div", { onClick: () => onCombination(intervalType, e.limit + ''), className: `${limit === e.limit + '' ? 'bg-[#E6EBF5]' : 'bg-[#F7F7F7]'} w-fit px-[7px] py-[2px] rounded-[5px] text-[12px] cursor-pointer hover:bg-[#eee]`, children: e.label }, 'scopeLimit' + i)))] })] }));
};
exports.default = ChartOptions;
