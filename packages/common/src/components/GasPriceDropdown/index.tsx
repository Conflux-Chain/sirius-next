import React, { useState, useEffect, useCallback } from 'react';
import { Translation } from 'react-i18next';
import { useGasPrice, getTranslations } from '../../store';
import { sendRequestGasPrice } from '../../utils/request';
import { useInterval } from 'react-use';

import { fromDripToGdrip } from '../../utils';
import { SkeletonContainer } from '../SkeletonContainer';

import IconGas from '../../images/icon-gas.svg';
import IconRefresh from '../../images/refresh.svg';
import GasLow from '../../images/gas-low.png';
import GasMedian from '../../images/gas-median.png';
import GasHigh from '../../images/gas-high.png';
import ArrowDown from '../../images/arrowDown.svg';

const roundNumberWithSuffix = (value: string): string => {
  if (value.startsWith('<')) return value;

  const numericPart = parseFloat(value);
  if (isNaN(numericPart)) {
    throw new Error('Invalid number');
  }

  const roundedNumber = Math.round(numericPart * 10) / 10;

  const suffix = value.replace(/[0-9.-]/g, '');

  const roundedString =
    roundedNumber % 1 === 0 ? roundedNumber : roundedNumber.toFixed(1);

  return roundedString + suffix;
};
const refreshGasPrice = {
  init: false,
};
interface GasPriceDropdownProps {
  unit?: string;
}

export const GasPriceDropdown: React.FC<GasPriceDropdownProps> = ({
  unit = 'Gdrip',
}) => {
  const translations = getTranslations();

  const [showModal, setShowModal] = useState(false);
  const { gasPriceData, setGasPrice } = useGasPrice();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showModal && !target.closest('.modal')) {
        setShowModal(false);
      }
    },
    [showModal],
  );

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    const res = await sendRequestGasPrice();
    if (res) {
      setGasPrice(res);
    }
    setIsRefreshing(false);
  }, [setGasPrice]);

  useEffect(() => {
    if (!refreshGasPrice.init) {
      refreshGasPrice.init = true;
      refreshData();
    }
  }, [refreshData]);

  useInterval(() => {
    refreshData();
  }, 20000);

  useEffect(() => {
    if (showModal) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showModal, handleOutsideClick]);

  return (
    <div className="relative">
      <div
        className="flex gap-1 text-[#424a71] ml-2.5 cursor-pointer text-[14px]"
        onClick={() => setShowModal(true)}
      >
        <SkeletonContainer shown={gasPriceData.gasPriceInfo.tp50 === 0}>
          <img src={IconGas} alt="" />
          <span className="text-[var(--theme-color-primary)]">
            {roundNumberWithSuffix(
              fromDripToGdrip(gasPriceData.gasPriceInfo.tp50, false, {
                precision: 1,
                minNum: 0.1,
              }),
            )}
          </span>
          <span>{unit}</span>
        </SkeletonContainer>
      </div>
      {showModal && (
        <div className="modal animate-in fade-in w-full min-h-[fit-content] bg-[#FFF] fixed right-0 top-[53px] p-[16px] z-10 shadow-modal md:w-[400px] md:absolute md:top-[35px]">
          <div className="flex justify-between">
            <div className="font-bold text-[#20253a] text-[16px] text-[14px]">
              <Translation>
                {t => t(translations.gaspriceDropdown.blockHeight)}
              </Translation>
              :
              <SkeletonContainer shown={gasPriceData.blockHeight === 0}>
                {gasPriceData.blockHeight}
              </SkeletonContainer>
            </div>
            <img
              className={
                'active:scale-75 ' +
                (isRefreshing
                  ? 'animate-in spin-in--360 animate-duration-300'
                  : '')
              }
              src={IconRefresh}
              alt=""
              onClick={() => refreshData()}
            />
          </div>
          <div className="mt-3 flex gap-[8px]">
            <div className="flex flex-col justify-center items-center flex-1 bg-[#fafbfc] p-2">
              <img
                className="w-[29.71px] h-[24.36px] mt-1.5"
                src={GasLow}
                alt=""
              />
              <div className="font-bold text-[14px] leading-6 text-[14px] mt-1.5">
                <Translation>
                  {t => t(translations.gaspriceDropdown.low)}
                </Translation>
              </div>
              <div className="text-[18px] mt-1.5 leading-5 font-bold text-center text-[#4ca960]">
                <SkeletonContainer shown={gasPriceData.gasPriceInfo.min === 0}>
                  {roundNumberWithSuffix(
                    fromDripToGdrip(gasPriceData.gasPriceInfo.min, false, {
                      precision: 1,
                      minNum: 0.1,
                    }),
                  )}{' '}
                  {unit}
                </SkeletonContainer>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center flex-1 bg-[#fafbfc] p-2">
              <img
                className="w-[29.71px] h-[24.36px] mt-1.5"
                src={GasMedian}
                alt=""
              />
              <div className="font-bold text-[14px] leading-6 text-[14px] mt-1.5">
                <Translation>
                  {t => t(translations.gaspriceDropdown.median)}
                </Translation>
              </div>
              <div className="text-[18px] mt-1.5 leading-5 font-bold text-center text-[#395bd4]">
                <SkeletonContainer shown={gasPriceData.gasPriceInfo.tp50 === 0}>
                  {roundNumberWithSuffix(
                    fromDripToGdrip(gasPriceData.gasPriceInfo.tp50, false, {
                      precision: 1,
                      minNum: 0.1,
                    }),
                  )}{' '}
                  {unit}
                </SkeletonContainer>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center flex-1 bg-[#fafbfc] p-2">
              <img
                className="w-[29.71px] h-[24.36px] mt-1.5"
                src={GasHigh}
                alt=""
              />
              <div className="font-bold text-[14px] leading-6 text-[14px] mt-1.5">
                <Translation>
                  {t => t(translations.gaspriceDropdown.high)}
                </Translation>
              </div>
              <div className="text-[18px] mt-1.5 leading-5 font-bold text-center text-[#d74841]">
                <SkeletonContainer shown={gasPriceData.gasPriceInfo.max === 0}>
                  {roundNumberWithSuffix(
                    fromDripToGdrip(gasPriceData.gasPriceInfo.max, false, {
                      precision: 1,
                      minNum: 0.1,
                    }),
                  )}{' '}
                  {unit}
                </SkeletonContainer>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="w-full flex justify-between mt-4 text-[#424a71] text-[14px] font-bold">
              <div>
                <Translation>
                  {t => t(translations.gaspriceDropdown.market)}
                </Translation>
              </div>

              <div className="text-[#9b9eac] text-[12px]">
                <Translation>
                  {t => t(translations.gaspriceDropdown.latest60Blocks)}
                </Translation>
              </div>
            </div>
            <div className="absolute text-[10px] text-[#9b9eac] mt-2 left-[25%]">
              <div className="fit-content transform -translate-x-1/2 text-center">
                {roundNumberWithSuffix(
                  fromDripToGdrip(gasPriceData.gasPriceMarket.tp25, false, {
                    precision: 1,
                    minNum: 0.1,
                  }),
                )}
              </div>
              <img
                className="mt-[-12px]"
                src={ArrowDown}
                alt="?"
                style={{ transform: 'translateX(-50%)' }}
              />
            </div>
            <div className="absolute text-[10px] text-[#9b9eac] mt-2 left-[75%]">
              <div className="fit-content transform -translate-x-1/2 text-center">
                {roundNumberWithSuffix(
                  fromDripToGdrip(gasPriceData.gasPriceMarket.tp75, false, {
                    precision: 1,
                    minNum: 0.1,
                  }),
                )}
              </div>
              <img
                className="mt-[-12px]"
                src={ArrowDown}
                alt="?"
                style={{ transform: 'translateX(-50%)' }}
              />
            </div>
            <div className="mt-[32px] w-full flex gap-0.5">
              <div className="w-1/4 h-2 bg-[var(--theme-color-gas-price-line-bg)] rounded-l-md"></div>
              <div className="w-1/2 h-2 bg-[var(--theme-color-primary)]"></div>
              <div className="w-1/4 h-2 bg-[var(--theme-color-gas-price-line-bg)] rounded-r-md"></div>
            </div>
            <div className="w-full flex justify-between mt-1">
              <div>
                <div className="text-[12px] text-[14px] text-[#9b9eac]">
                  Min
                </div>
                <div className="text-left text-[12px] font-semibold text-[#424a71]">
                  {roundNumberWithSuffix(
                    fromDripToGdrip(gasPriceData.gasPriceMarket.min, false, {
                      precision: 1,
                      minNum: 0.1,
                    }),
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="absolute w-px h-3 bg-[var(--theme-color-primary)] mt-[-10px] left-1/2"></div>
                <div className="text-[12px] text-[14px] text-[#9b9eac]">
                  Mid
                </div>
                <div className="text-center text-[12px] font-semibold text-[var(--theme-color-primary)]">
                  {roundNumberWithSuffix(
                    fromDripToGdrip(gasPriceData.gasPriceMarket.tp50, false, {
                      precision: 1,
                      minNum: 0.1,
                    }),
                  )}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[14px] text-[#9b9eac]">
                  Max
                </div>
                <div className="text-right text-[12px] font-semibold text-[#424a71]">
                  {roundNumberWithSuffix(
                    fromDripToGdrip(gasPriceData.gasPriceMarket.max, false, {
                      precision: 1,
                      minNum: 0.1,
                    }),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="md:hidden fixed top-[53px] left-0 w-full h-[920px] bg-[#000] bg-opacity-50 flex justify-center items-center z-[-1]"></div>
      )}
    </div>
  );
};
