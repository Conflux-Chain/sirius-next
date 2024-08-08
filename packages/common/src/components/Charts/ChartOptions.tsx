import { useTranslation } from 'react-i18next';
import { useI18n } from '../../store';
import { ScopeItemType, ScopeType, ChartOptionsProps, scope } from './config';

const desiredOrder = ['min', 'hour', 'day', 'week', 'month', 'year'];

const ChartOptions = ({
  intervalScope,
  intervalType,
  limit,
  onCombination,
}: ChartOptionsProps) => {
  const { t } = useTranslation();
  const { translations } = useI18n();
  const intervalScopeDefault = intervalScope || { day: scope.day };

  const sortedIntervalScopeKeys = Object.keys(intervalScopeDefault).sort(
    (a, b) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b),
  );

  return (
    <div className="flex relative z-2 top-[10px] mb-[20px] left-[40px] gap-[10px] flex-col chartsFilter:flex-row chartsFilter:gap-0">
      <div className="flex gap-[3px] mr-[20px]">
        <div>{t(translations.highcharts.options.time)}:</div>
        {sortedIntervalScopeKeys.map((e, i) => {
          const scopeItemArray = intervalScopeDefault[e as keyof ScopeType];
          const lastScopeItem = scopeItemArray?.[scopeItemArray.length - 1];
          const lastItemLimit = lastScopeItem?.limit;

          return (
            <div
              className={`${intervalType === e ? 'bg-[#E6EBF5]' : 'bg-[#F7F7F7]'} w-fit px-[7px] py-[2px] rounded-[5px] text-[12px] cursor-pointer hover:bg-[#eee]`}
              key={'scopeKey' + i}
              onClick={() =>
                onCombination(e as keyof ScopeType, lastItemLimit + '')
              }
            >
              {e}
            </div>
          );
        })}
      </div>
      <div className="flex gap-[3px]">
        <div>{t(translations.highcharts.options.range)}:</div>
        {intervalScopeDefault[intervalType]?.map(
          (e: ScopeItemType, i: number) => (
            <div
              key={'scopeLimit' + i}
              onClick={() => onCombination(intervalType, e.limit + '')}
              className={`${limit === e.limit + '' ? 'bg-[#E6EBF5]' : 'bg-[#F7F7F7]'} w-fit px-[7px] py-[2px] rounded-[5px] text-[12px] cursor-pointer hover:bg-[#eee]`}
            >
              {e.label}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default ChartOptions;
