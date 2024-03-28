
import { ScopeItemType, ScopeType, ChartOptionsProps, scope } from './config'

const ChartOptions = ({ intervalScope, intervalType, limit, onCombination }: ChartOptionsProps) => {
    const intervalScopeDefault = intervalScope || { day: scope.day };
    return (
      <div className="flex relative z-2 top-[10px] mb-[20px] left-[40px]">
        <div className='flex gap-[3px] mr-[20px]'>
            <div>Time Granularity:</div>
            {Object.keys(intervalScopeDefault).map((e, i) => {
                const scopeItemArray = intervalScopeDefault[e as keyof ScopeType];
                const lastScopeItem = scopeItemArray?.[scopeItemArray.length - 1];
                const lastItemLimit = lastScopeItem?.limit;
    
                return (
                <div
                    className={`${intervalType === e ? 'bg-[#E6EBF5]' : 'bg-[#F7F7F7]'} w-fit px-[7px] py-[2px] rounded-[5px] text-[12px] cursor-pointer hover:bg-[#eee]`}
                    key={'scopeKey' + i}
                    onClick={() => onCombination(e as keyof ScopeType, lastItemLimit+'')}
                    >
                    {e}
                </div>
                );
            })}
        </div>
        <div className="flex gap-[3px]">
            <div>Date Range:</div>
            {intervalScopeDefault[intervalType]?.map((e: ScopeItemType, i: number) => (
                <div
                    key={'scopeLimit' + i}
                    onClick={() => onCombination(intervalType, e.limit+'')}
                    className={`${limit === e.limit+'' ? 'bg-[#E6EBF5]' : 'bg-[#F7F7F7]'} w-fit px-[7px] py-[2px] rounded-[5px] text-[12px] cursor-pointer hover:bg-[#eee]`}
                    >
                    {e.label}
                </div>
            ))}
        </div>
      </div>
    );
  };
  
  export default ChartOptions;