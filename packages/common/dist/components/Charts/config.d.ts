import Highcharts from 'highcharts/highstock';

declare const defaultLimit: string;
declare const defaultIntervalType: string;
interface ChildProps {
    preview?: boolean;
}
interface ChartsProps {
    request: {
        url: string;
        query?: {
            limit: string;
            intervalType: string;
        };
        formatter: (data: any) => any;
    };
    options: any;
    data?: {
        list: any[];
    };
}
interface ScopeItemType {
    label: string;
    limit: number;
}
interface ScopeType {
    min?: ScopeItemType[];
    hour?: ScopeItemType[];
    day: ScopeItemType[];
    month?: ScopeItemType[];
}
type onCombination = (type: keyof ScopeType, limit: string | undefined) => void;
type ChartOptionsProps = {
    intervalScope?: ScopeType;
    intervalType: keyof ScopeType;
    limit: string | undefined;
    onCombination: onCombination;
};
declare const scope: ScopeType;
declare const ConstructorType: ({ options }: ChartsProps) => "" | "stockChart";
declare const optsOrigin: ({ options, request, data }: ChartsProps) => {
    chart: {
        animation: boolean;
        height: number;
    };
    credits: {
        enabled: boolean;
    };
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: {
                    x1: number;
                    y1: number;
                    x2: number;
                    y2: number;
                };
                stops: ((string | number | undefined)[] | (number | Highcharts.ColorType)[])[];
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
        pie: {
            allowPointSelect: boolean;
            cursor: string;
            dataLabels: {
                enabled: boolean;
            };
            showInLegend: boolean;
            colorByPoint: boolean;
        };
    };
    tooltip: {
        shape: string;
    };
    series: {
        data: any;
    }[];
    exporting: {
        enabled: boolean;
        buttons: {
            contextButton: {
                menuItems: string[];
            };
        };
    };
} | {
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
                stops: ((string | number | undefined)[] | (number | Highcharts.ColorType)[])[];
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
    legend: {
        enabled: boolean;
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
    series: any;
    exporting: {
        enabled: boolean;
        buttons: {
            contextButton: {
                menuItems: string[];
            };
        };
    };
};
declare const previewOpts: {
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

export { type ChartOptionsProps, type ChartsProps, type ChildProps, ConstructorType, type ScopeItemType, type ScopeType, defaultIntervalType, defaultLimit, type onCombination, optsOrigin, previewOpts, scope };
