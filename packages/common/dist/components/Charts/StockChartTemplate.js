"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockChartTemplate = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const highstock_1 = __importDefault(require("highcharts/highstock"));
const highcharts_react_official_1 = __importDefault(require("highcharts-react-official"));
const exporting_1 = __importDefault(require("highcharts/modules/exporting"));
const export_data_1 = __importDefault(require("highcharts/modules/export-data"));
const swr_1 = __importDefault(require("swr"));
const httpRequest_1 = require("../../utils/httpRequest");
const utils_1 = require("../../utils");
const StockTitle_1 = __importDefault(require("./StockTitle"));
const BreadcrumbNav_1 = __importDefault(require("./BreadcrumbNav"));
const ChartOptions_1 = __importDefault(require("./ChartOptions"));
const config_1 = require("./config");
(0, exporting_1.default)(highstock_1.default);
(0, export_data_1.default)(highstock_1.default);
function StockChartTemplate({ options, request }) {
    const chart = (0, react_1.useRef)(null);
    const [limit, setLimit] = (0, react_1.useState)(request?.query?.limit || config_1.defaultLimit);
    const [intervalType, setIntervalType] = (0, react_1.useState)(request?.query?.intervalType || config_1.defaultIntervalType);
    const sendRequests = (0, react_1.useCallback)(() => {
        return (0, httpRequest_1.sendRequest)({
            url: request.url,
            query: {
                ...request.query,
                limit: limit || config_1.defaultLimit,
                intervalType: intervalType,
            },
        });
    }, [request.url, request.query, intervalType, limit, config_1.defaultLimit]);
    const { data, isLoading } = (0, swr_1.default)(request.url + intervalType + limit, sendRequests);
    const handleCombination = (type, limit) => {
        // @ts-ignore
        // chart.current?.chart.xAxis[0].setExtremes(null, null);
        if (type)
            setIntervalType(type);
        if (limit)
            setLimit(limit);
    };
    (0, react_1.useEffect)(() => {
        if (isLoading) {
            // @ts-ignore
            chart.current?.chart.showLoading();
        }
        else {
            // @ts-ignore
            chart.current?.chart.hideLoading();
        }
    }, [isLoading]);
    console.log(data);
    const opts = {
        ...(0, utils_1.mergeDeep)(config_1.opts, options),
        legend: {
            enabled: options.series.length > 1,
        },
        series: options.series.map((_, i) => ({
            data: request.formatter(data?.data)[i],
        })),
        intervalType: { value: intervalType },
    };
    return (0, jsx_runtime_1.jsxs)("div", { className: '', children: [(0, jsx_runtime_1.jsx)(BreadcrumbNav_1.default, { breadcrumb: opts.header.breadcrumb }), (0, jsx_runtime_1.jsx)(StockTitle_1.default, { header: opts.header }), (0, jsx_runtime_1.jsxs)("div", { className: 'bg-[#FFF] relative p-[1.2857rem] rounded-[4px] color-[#333]', style: { boxShadow: 'rgba(20, 27, 50, 0.12) 0.8571rem' }, children: [(0, jsx_runtime_1.jsx)(ChartOptions_1.default, { intervalScope: opts.intervalScope, intervalType: intervalType, limit: limit, onCombination: handleCombination }), (0, jsx_runtime_1.jsx)(highcharts_react_official_1.default, { constructorType: 'stockChart', highcharts: highstock_1.default, options: opts, ref: chart })] })] });
}
exports.StockChartTemplate = StockChartTemplate;
