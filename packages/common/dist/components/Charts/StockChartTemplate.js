import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import useSWR from 'swr';
import { sendRequestChart } from '../../utils/request';
import StockTitle from './StockTitle';
import BreadcrumbNav from './BreadcrumbNav';
import ChartOptions from './ChartOptions';
import lodash from 'lodash';
import { optsOrigin, defaultLimit, defaultIntervalType, } from './config';
Exporting(Highcharts);
ExportData(Highcharts);
export function StockChartTemplate({ options, request }) {
    const chart = useRef(null);
    const [limit, setLimit] = useState(request?.query?.limit || defaultLimit);
    const [intervalType, setIntervalType] = useState(request?.query?.intervalType || defaultIntervalType);
    const sendRequestCallback = useCallback(() => {
        return sendRequestChart({
            url: request.url,
            query: {
                ...request.query,
                limit: limit || defaultLimit,
                intervalType: intervalType,
            },
        });
    }, [request.url, request.query, intervalType, limit, defaultLimit]);
    const { data, isLoading } = useSWR(request.url + intervalType + limit, sendRequestCallback);
    const handleCombination = (type, limit) => {
        // @ts-ignore
        // chart.current?.chart.xAxis[0].setExtremes(null, null);
        if (type)
            setIntervalType(type);
        if (limit)
            setLimit(limit);
    };
    useEffect(() => {
        if (isLoading) {
            // @ts-ignore
            chart.current?.chart.showLoading();
        }
        else {
            // @ts-ignore
            chart.current?.chart.hideLoading();
        }
    }, [isLoading]);
    const optsOrigins = optsOrigin({ options, request, data });
    const opts = lodash.merge(optsOrigins, options);
    opts.intervalType = { value: intervalType };
    return (_jsxs("div", { children: [_jsx(BreadcrumbNav, { breadcrumb: opts.header.breadcrumb }), _jsx(StockTitle, { header: opts.header }), _jsxs("div", { className: "bg-[#FFF] relative p-[1.2857rem] rounded-[4px] color-[#333]", style: { boxShadow: 'rgba(20, 27, 50, 0.12) 0.8571rem' }, children: [_jsx(ChartOptions, { intervalScope: opts.intervalScope, intervalType: intervalType, limit: limit, onCombination: handleCombination }), _jsx(HighchartsReact, { constructorType: 'stockChart', highcharts: Highcharts, options: opts, ref: chart })] })] }));
}
