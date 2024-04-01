import { useEffect, useRef, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import useSWR from 'swr';
import PreviewTitle from './PreviewTitle'
import { sendRequestChart } from '../../utils/request';
import lodash from 'lodash';
import { ChartsProps, optsOrigin, previewOpts, defaultLimit, defaultIntervalType } from './config';

export function PreviewChartTemplate({options, request}: ChartsProps) {
    
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

    const { data, isLoading } = useSWR(request.url+intervalType+limit, sendRequestCallback);

    useEffect(() => {
        if (isLoading) {
            // @ts-ignore
            chart.current?.chart.showLoading();
        } else {
            // @ts-ignore
            chart.current?.chart.hideLoading();
        }
    },[isLoading])

    const optsOrigins = optsOrigin({options, request, data});
    const opts = lodash.merge(optsOrigins, options, previewOpts)
    opts.intervalType = { value: intervalType }


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