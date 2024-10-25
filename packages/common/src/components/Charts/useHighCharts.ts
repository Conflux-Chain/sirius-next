import { useEffect } from 'react';
import HighCharts from 'highcharts/highstock';
import { useTranslation } from 'react-i18next';
import {
  localeData,
  tooltipData,
  xAxisData,
} from 'src/components/Charts/constants';

export const useHighCharts = (chart?: any) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';

  useEffect(() => {
    HighCharts.setOptions({
      lang: localeData[lang],
      tooltip: tooltipData[lang],
      xAxis: xAxisData[lang],
    });
    const c = chart.current?.chart;
    if (c) {
      c.options.lang = {
        ...chart.current.chart.options.lang,
        ...localeData[lang],
      };
    }
  }, [lang, chart]);

  return { lang };
};
