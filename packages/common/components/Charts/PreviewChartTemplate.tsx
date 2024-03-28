import React, { useRef, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import useSWR from 'swr';
import PreviewTitle from './PreviewTitle'
import { sendRequest } from '../../utils/request';
import { mergeDeep } from '../../utils'

import { ChartsProps, opts as optsOrigin, previewOpts,  defaultLimit, defaultIntervalType } from './config';

export function PreviewChartTemplate({options, request}: ChartsProps) {
    
    const chart = useRef(null);
    const limit = request?.query?.limit || defaultLimit;
    const intervalType = request?.query?.intervalType || defaultIntervalType;

    const sendRequestCallback = useCallback(() => {
        return sendRequest({
            url: request.url,
            query: {
                ...request.query,
                limit,
                intervalType,
            },
        });
    }, [request.url, request.query, intervalType]);

    const { data } = useSWR(request.url+intervalType+limit, sendRequestCallback);


    const opts = {
        ...mergeDeep(optsOrigin, options, previewOpts),
        legend: {
            enabled: options.series.length > 1,
        },
        series: options.series.map((_:any, i:number) => ({
            data: request.formatter(data)[i],
        })),
        intervalType: { value: intervalType },
    }


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