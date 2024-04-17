import {
  StockTitle_default
} from "../../chunk-PTT2OZV4.js";
import {
  BreadcrumbNav_default
} from "../../chunk-WLKMIQSZ.js";
import {
  ChartOptions_default
} from "../../chunk-FCMOSB7E.js";
import "../../chunk-EXW5F6NL.js";
import {
  ConstructorType,
  defaultIntervalType,
  defaultLimit,
  optsOrigin
} from "../../chunk-P5STBOCR.js";
import "../../chunk-F2UNHDUR.js";
import {
  sendRequestChart
} from "../../chunk-KSSYWOD6.js";
import "../../chunk-4LQWWDGW.js";
import "../../chunk-ADTPJ4V5.js";

// src/components/Charts/StockChartTemplate.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import useSWR from "swr";
import lodash from "lodash";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
Exporting(Highcharts);
ExportData(Highcharts);
function StockChartTemplate({ options, request }) {
  const chart = useRef(null);
  const [limit, setLimit] = useState(request?.query?.limit || defaultLimit);
  const [intervalType, setIntervalType] = useState(
    request?.query?.intervalType || defaultIntervalType
  );
  const sendRequestCallback = useCallback(() => {
    return sendRequestChart({
      url: request.url,
      query: {
        ...request.query,
        limit: limit || defaultLimit,
        intervalType
      }
    });
  }, [request.url, request.query, intervalType, limit, defaultLimit]);
  const { data, isLoading } = useSWR(
    request.url + intervalType + limit,
    sendRequestCallback,
    {
      revalidateOnFocus: false
    }
  );
  const handleCombination = (type, limit2) => {
    if (type)
      setIntervalType(type);
    if (limit2)
      setLimit(limit2);
  };
  useEffect(() => {
    if (isLoading) {
      chart.current?.chart.showLoading();
    } else {
      chart.current?.chart.hideLoading();
    }
  }, [isLoading]);
  const optsOrigins = optsOrigin({ options, request, data });
  const opts = lodash.merge(optsOrigins, options);
  opts.intervalType = { value: intervalType };
  const constructorType = ConstructorType({ options, request });
  return /* @__PURE__ */ jsxs("div", { children: [
    opts.header.breadcrumbShow !== false ? /* @__PURE__ */ jsx(BreadcrumbNav_default, { breadcrumb: opts.header.breadcrumb }) : /* @__PURE__ */ jsx(Fragment, {}),
    opts.header.titleShow !== false ? /* @__PURE__ */ jsx(StockTitle_default, { header: opts.header }) : /* @__PURE__ */ jsx(Fragment, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-[#FFF] relative p-[1.2857rem] rounded-[4px] color-[#333]",
        style: { boxShadow: "rgba(20, 27, 50, 0.12) 0.8571rem" },
        children: [
          opts.header.optionShow !== false ? /* @__PURE__ */ jsx(
            ChartOptions_default,
            {
              intervalScope: opts.intervalScope,
              intervalType,
              limit,
              onCombination: handleCombination
            }
          ) : /* @__PURE__ */ jsx(Fragment, {}),
          /* @__PURE__ */ jsx(
            HighchartsReact,
            {
              constructorType,
              highcharts: Highcharts,
              options: opts,
              ref: chart
            }
          )
        ]
      }
    )
  ] });
}
export {
  StockChartTemplate
};
//# sourceMappingURL=StockChartTemplate.js.map