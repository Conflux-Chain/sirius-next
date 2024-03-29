"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewChartTemplate = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const highstock_1 = __importDefault(require("highcharts/highstock"));
const highcharts_react_official_1 = __importDefault(require("highcharts-react-official"));
const swr_1 = __importDefault(require("swr"));
const PreviewTitle_1 = __importDefault(require("./PreviewTitle"));
const request_1 = require("../../utils/request");
const lodash_1 = __importDefault(require("lodash"));
const config_1 = require("./config");
function PreviewChartTemplate({ options, request }) {
    const chart = (0, react_1.useRef)(null);
    const limit = request?.query?.limit || config_1.defaultLimit;
    const intervalType = request?.query?.intervalType || config_1.defaultIntervalType;
    const sendRequestCallback = (0, react_1.useCallback)(() => {
        return (0, request_1.sendRequestChart)({
            url: request.url,
            query: {
                ...request.query,
                limit,
                intervalType,
            },
        });
    }, [request.url, request.query, intervalType]);
    const { data, isLoading } = (0, swr_1.default)(request.url + intervalType + limit, sendRequestCallback);
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
    const optsOrigins = (0, config_1.optsOrigin)({ options, request, data });
    const opts = lodash_1.default.merge(optsOrigins, options, config_1.previewOpts);
    opts.intervalType = { value: intervalType };
    return (0, jsx_runtime_1.jsxs)("div", { className: "bg-[#FFFFFF] border border-[#E5E5E5] rounded-lg shadow-sm", children: [(0, jsx_runtime_1.jsx)(PreviewTitle_1.default, { header: opts.header }), (0, jsx_runtime_1.jsx)("div", { className: 'p-[1.2857rem]', children: (0, jsx_runtime_1.jsx)(highcharts_react_official_1.default, { constructorType: 'stockChart', highcharts: highstock_1.default, options: opts, ref: chart }) })] });
}
exports.PreviewChartTemplate = PreviewChartTemplate;
