import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import useSWR from 'swr';
import PreviewTitle from './PreviewTitle';
import { sendRequestChart } from '../../utils/request';
import lodash from 'lodash';
import { optsOrigin, previewOpts, defaultLimit, defaultIntervalType, ConstructorType, } from './config';
export function PreviewChartTemplate({ options, request }) {
    const chart = useRef(null);
    const limit = request?.query?.limit || defaultLimit;
    const intervalType = request?.query?.intervalType || defaultIntervalType;
    const sendRequestCallback = useCallback(() => {
        return sendRequestChart({
            url: request.url,
            query: {
                ...request.query,
                limit,
                intervalType,
            },
        });
    }, [request.url, request.query, intervalType]);
    const { data, isLoading } = useSWR(request.url + intervalType + limit, sendRequestCallback);
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
    const opts = lodash.merge(optsOrigins, options, previewOpts);
    opts.intervalType = { value: intervalType };
    const constructorType = ConstructorType({ options, request });
    return (_jsxs("div", { className: "bg-[#FFFFFF] border border-[#E5E5E5] rounded-lg shadow-sm", children: [_jsx(PreviewTitle, { header: opts.header }), _jsx("div", { className: "p-[1.2857rem]", children: _jsx(HighchartsReact, { constructorType: constructorType, highcharts: Highcharts, options: opts, ref: chart }) })] }));
}
