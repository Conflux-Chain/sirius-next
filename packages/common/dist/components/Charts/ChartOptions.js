import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { scope } from './config';
const ChartOptions = ({ intervalScope, intervalType, limit, onCombination }) => {
    const intervalScopeDefault = intervalScope || { day: scope.day };
    return (_jsxs("div", { className: "flex relative z-2 top-[10px] mb-[20px] left-[40px]", children: [_jsxs("div", { className: 'flex gap-[3px] mr-[20px]', children: [_jsx("div", { children: "Time Granularity:" }), Object.keys(intervalScopeDefault).map((e, i) => {
                        const scopeItemArray = intervalScopeDefault[e];
                        const lastScopeItem = scopeItemArray?.[scopeItemArray.length - 1];
                        const lastItemLimit = lastScopeItem?.limit;
                        return (_jsx("div", { className: `${intervalType === e ? 'bg-[#E6EBF5]' : 'bg-[#F7F7F7]'} w-fit px-[7px] py-[2px] rounded-[5px] text-[12px] cursor-pointer hover:bg-[#eee]`, onClick: () => onCombination(e, lastItemLimit + ''), children: e }, 'scopeKey' + i));
                    })] }), _jsxs("div", { className: "flex gap-[3px]", children: [_jsx("div", { children: "Date Range:" }), intervalScopeDefault[intervalType]?.map((e, i) => (_jsx("div", { onClick: () => onCombination(intervalType, e.limit + ''), className: `${limit === e.limit + '' ? 'bg-[#E6EBF5]' : 'bg-[#F7F7F7]'} w-fit px-[7px] py-[2px] rounded-[5px] text-[12px] cursor-pointer hover:bg-[#eee]`, children: e.label }, 'scopeLimit' + i)))] })] }));
};
export default ChartOptions;
