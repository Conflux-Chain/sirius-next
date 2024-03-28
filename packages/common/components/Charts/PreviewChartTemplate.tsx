import React, { useRef, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import useSWR from 'swr';
import PreviewTitle from './PreviewTitle'
import { sendRequest } from '../../utils/httpRequest';
import { mergeDeep } from '../../utils'

import { ChartsProps, opts as optsOrigin, defaultLimit, defaultIntervalType } from './config';

export function PreviewChartTemplate({options, request}: ChartsProps) {
    
    const chart = useRef(null);
    const limit = request?.query?.limit || defaultLimit;
    const intervalType = request?.query?.intervalType || defaultIntervalType;

    const sendRequests = useCallback(() => {
        return sendRequest({
            url: request.url,
            query: {
                ...request.query,
                limit,
                intervalType,
            },
        });
    }, [request.url, request.query, intervalType]);

    const { data } = useSWR(request.url+intervalType+limit, sendRequests);

    console.log(data)
    const opts = {
        ...mergeDeep(optsOrigin, options),
        title: '',
        subtitle: '',
        legend: {
            enabled: options.series.length > 1,
        },
        series: options.series.map((_:any, i:number) => ({
            data: request.formatter(data?.data)[i],
        })),
        intervalType: { value: intervalType },
    }
    opts.chart.height = 240;
    opts.chart.zoomType = '';
    opts.exporting.enabled = false;
    opts.navigator.enabled = false;
    opts.rangeSelector.enabled = false;
    opts.scrollbar.enabled = false;

    return <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-lg shadow-sm">
        <PreviewTitle header={opts.header}></PreviewTitle>
        <div className='p-[1.2857rem]'>
            <HighchartsReact
                constructorType={'stockChart'}
                highcharts={Highcharts}
                options={opts}
                ref={chart}
            />
        </div>
        
    </div>;
}