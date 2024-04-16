// src/components/Charts/config.ts
import Highcharts from "highcharts/highstock";
var defaultLimit = "365";
var defaultIntervalType = "day";
var scope = {
  min: [
    {
      label: "1h",
      limit: 60
    },
    {
      label: "2h",
      limit: 120
    },
    {
      label: "4h",
      limit: 240
    },
    {
      label: "6h",
      limit: 360
    },
    {
      label: "12h",
      limit: 720
    },
    {
      label: "24h",
      limit: 1440
    }
  ],
  hour: [
    {
      label: "1d",
      limit: 24
    },
    {
      label: "3d",
      limit: 72
    },
    {
      label: "7d",
      limit: 168
    },
    {
      label: "14d",
      limit: 336
    }
  ],
  day: [
    {
      label: "1w",
      limit: 7
    },
    {
      label: "1m",
      limit: 30
    },
    {
      label: "3m",
      limit: 91
    },
    {
      label: "6m",
      limit: 182
    },
    {
      label: "1y",
      limit: 365
    },
    {
      label: "All",
      limit: 2e3
    }
  ],
  month: [
    {
      label: "6m",
      limit: 6
    },
    {
      label: "1y",
      limit: 12
    },
    {
      label: "All",
      limit: 2e3
    }
  ]
};
var ConstructorType = ({ options }) => {
  if (options?.chart?.type === "pie") {
    return "";
  }
  if (options?.chart?.type === "column") {
    return "";
  }
  return "stockChart";
};
var LineChart = ({ options, request, data }) => {
  return {
    chart: {
      alignTicks: false,
      height: 600,
      animation: false,
      backgroundColor: null
    },
    credits: {
      enabled: false
    },
    colors: [
      "#7cb5ec",
      "#434348",
      "#f7a35c",
      "#2b908f",
      "#91e8e1",
      "#90ed7d",
      "#8085e9",
      "#f15c80",
      "#e4d354",
      "#f45b5b"
    ],
    navigator: {
      enabled: true
    },
    rangeSelector: {
      enabled: true,
      buttons: []
    },
    scrollbar: {
      enabled: true
    },
    plotOptions: {
      series: {
        dataGrouping: {
          enabled: false
          // dateTimeLabelFormats: {
          //   week: ['%A, %b %e, %Y'],
          // },
        }
      },
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            // @ts-ignore
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              // @ts-ignore
              Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")
            ]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      },
      line: {
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        }
      }
    },
    legend: {
      enabled: options.series.length > 1
    },
    tooltip: {
      split: false,
      useHTML: true,
      headerFormat: `<table>
              <tr>
                <th colspan="2" style="font-weight: normal;">{point.key}</th>
              </tr>
              <tr style="border-bottom: 1px solid #ccc;">
                <th style="padding-bottom: 5px;"></th>
              </tr>
              `,
      pointFormat: `
            <tr><td style="padding-top: 5px;"></td></tr>
            <tr>
              <td style="color: {series.color}; padding-right: 10px;">[ {series.name} ]</td>
              <td style="text-align: right"><b>{point.y}</b></td>  
            </tr>`,
      footerFormat: "</table>",
      shape: "square",
      shared: true
    },
    yAxis: {
      opposite: false
    },
    series: options.series.map((_, i) => ({
      data: request.formatter(data)[i]
    })),
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
            "viewFullscreen",
            "printChart",
            "separator",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG",
            "downloadCSV",
            "downloadXLS"
          ]
        }
      }
    }
  };
};
var PieChart = ({ request, data }) => {
  return {
    chart: {
      animation: false,
      height: 600
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            // @ts-ignore
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              // @ts-ignore
              Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")
            ]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      },
      line: {
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        }
      },
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false
        },
        showInLegend: true,
        colorByPoint: true
      }
    },
    tooltip: {
      shape: "square"
    },
    series: [
      {
        data: request.formatter(data)
      }
    ],
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
            "printChart",
            "separator",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG",
            "downloadCSV",
            "downloadXLS"
          ]
        }
      }
    }
  };
};
var optsOrigin = ({ options, request, data }) => {
  if (options.chart.type === "pie") {
    return PieChart({ options, request, data });
  }
  if (options.chart.type === "column") {
    return PieChart({ options, request, data });
  }
  return LineChart({ options, request, data });
};
var previewOpts = {
  title: "",
  subtitle: "",
  chart: {
    height: 240,
    zoomType: ""
  },
  exporting: {
    enabled: false
  },
  navigator: {
    enabled: false
  },
  rangeSelector: {
    enabled: false
  },
  scrollbar: {
    enabled: false
  }
};

export {
  defaultLimit,
  defaultIntervalType,
  scope,
  ConstructorType,
  optsOrigin,
  previewOpts
};
//# sourceMappingURL=chunk-P5STBOCR.js.map