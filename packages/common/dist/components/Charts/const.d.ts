import Highcharts from 'highcharts/highstock';
export declare const defaultLimit: number;
export declare const defaultIntervalType: string;
interface ScopeItem {
    label: string;
    limit: number;
}
interface ScopeType {
    min?: ScopeItem[];
    hour?: ScopeItem[];
    day: ScopeItem[];
    month?: ScopeItem[];
}
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
    legend: {};
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
    xAxis: {
        events: {};
    };
    exporting: {
        enabled: boolean;
        buttons: {
            contextButton: {
                menuItems: string[];
            };
        };
    };
    subtitle: {};
};
export {};
//# sourceMappingURL=const.d.ts.map