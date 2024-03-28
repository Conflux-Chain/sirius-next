import Highcharts from 'highcharts/highstock';
export declare const defaultLimit: string;
export declare const defaultIntervalType: string;
export interface ChartsProps {
    request: {
        url: string;
        query?: {
            limit: string;
            intervalType: string;
        };
        formatter: (data: any) => any;
    };
    options: any;
}
export interface ScopeItemType {
    label: string;
    limit: number;
}
export interface ScopeType {
    min?: ScopeItemType[];
    hour?: ScopeItemType[];
    day: ScopeItemType[];
    month?: ScopeItemType[];
}
export type onCombination = (type: keyof ScopeType, limit: string | undefined) => void;
export type ChartOptionsProps = {
    intervalScope?: ScopeType;
    intervalType: keyof ScopeType;
    limit: string | undefined;
    onCombination: onCombination;
};
export declare const scope: ScopeType;
export declare const opts: {
    chart: {
        alignTicks: boolean;
        height: number;
        animation: boolean;
        backgroundColor: null;
    };
    credits: {
        enabled: boolean;
    };
    colors: string[];
    navigator: {
        enabled: boolean;
    };
    rangeSelector: {
        enabled: boolean;
        buttons: never[];
    };
    scrollbar: {
        enabled: boolean;
    };
    plotOptions: {
        series: {
            dataGrouping: {
                enabled: boolean;
            };
        };
        area: {
            fillColor: {
                linearGradient: {
                    x1: number;
                    y1: number;
                    x2: number;
                    y2: number;
                };
                stops: (string | number | Highcharts.GradientColorObject | Highcharts.PatternObject | undefined)[][];
            };
            marker: {
                radius: number;
            };
            lineWidth: number;
            states: {
                hover: {
                    lineWidth: number;
                };
            };
            threshold: null;
        };
        line: {
            lineWidth: number;
            states: {
                hover: {
                    lineWidth: number;
                };
            };
        };
    };
    tooltip: {
        split: boolean;
        useHTML: boolean;
        headerFormat: string;
        pointFormat: string;
        footerFormat: string;
        shape: string;
        shared: boolean;
    };
    yAxis: {
        opposite: boolean;
    };
    exporting: {
        enabled: boolean;
        buttons: {
            contextButton: {
                menuItems: string[];
            };
        };
    };
};
export declare const previewOpts: {
    title: string;
    subtitle: string;
    chart: {
        height: number;
        zoomType: string;
    };
    exporting: {
        enabled: boolean;
    };
    navigator: {
        enabled: boolean;
    };
    rangeSelector: {
        enabled: boolean;
    };
    scrollbar: {
        enabled: boolean;
    };
};
//# sourceMappingURL=config.d.ts.map