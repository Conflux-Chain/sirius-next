import {
  PreviewTitle_default
} from "../../chunk-VBPYDULG.js";
import {
  sendRequestChart
} from "../../chunk-CXZHHWAG.js";
import "../../chunk-ELZCOMBE.js";
import "../../chunk-ADTPJ4V5.js";
import "../../chunk-EXW5F6NL.js";
import {
  ConstructorType,
  defaultIntervalType,
  defaultLimit,
  optsOrigin,
  previewOpts
} from "../../chunk-P5STBOCR.js";
import "../../chunk-DE2BHFIR.js";

// src/components/Charts/PreviewChartTemplate.tsx
import { useEffect, useRef, useCallback } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import useSWR from "swr";
import lodash from "lodash";
import { jsx, jsxs } from "react/jsx-runtime";
function PreviewChartTemplate({ options, request }) {
  const chart = useRef(null);
  const limit = request?.query?.limit || defaultLimit;
  const intervalType = request?.query?.intervalType || defaultIntervalType;
  const sendRequestCallback = useCallback(() => {
    return sendRequestChart({
      url: request.url,
      query: {
        ...request.query,
        limit,
        intervalType
      }
    });
  }, [request.url, request.query, intervalType]);
  const { data, isLoading } = useSWR(
    request.url + intervalType + limit,
    sendRequestCallback,
    {
      revalidateOnFocus: false
    }
  );
  useEffect(() => {
    if (isLoading) {
      chart.current?.chart.showLoading();
    } else {
      chart.current?.chart.hideLoading();
    }
  }, [isLoading]);
  const optsOrigins = optsOrigin({ options, request, data });
  const opts = lodash.merge(optsOrigins, options, previewOpts);
  opts.intervalType = { value: intervalType };
  const constructorType = ConstructorType({ options, request });
  return /* @__PURE__ */ jsxs("div", { className: "bg-[#FFFFFF] border border-[#E5E5E5] rounded-lg shadow-sm", children: [
    /* @__PURE__ */ jsx(PreviewTitle_default, { header: opts.header }),
    /* @__PURE__ */ jsx("div", { className: "p-[1.2857rem]", children: /* @__PURE__ */ jsx(
      HighchartsReact,
      {
        constructorType,
        highcharts: Highcharts,
        options: opts,
        ref: chart
      }
    ) })
  ] });
}
export {
  PreviewChartTemplate
};
//# sourceMappingURL=PreviewChartTemplate.js.map