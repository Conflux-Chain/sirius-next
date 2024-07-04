import React, { useState, useEffect, useCallback } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useGasPrice, getTranslations, useI18n } from '../../store';
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
import { GasPriceDetail } from 'src/store/types';

const roundNumberWithSuffix = (value: string): string => {
  if (value === '< 0.001') return value;

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

const GasInfoCard: React.FC<{
  gasInfo: GasPriceDetail;
  img: string;
  title: string;
  gasPriceColor: string;
}> = ({ gasInfo, img, title, gasPriceColor }) => {
  const { t } = useTranslation();
  const { translations } = useI18n();
  return (
    <div className="flex flex-col justify-center items-center flex-1 bg-[#fafbfc] p-2">
      <img className="w-[29.71px] h-[24.36px] mt-1.5" src={img} alt="" />
      <div className="font-bold text-[14px] leading-6 text-[14px] mt-1.5">
        {title}
      </div>
      <div className="mt-1.5 text-center">
        <SkeletonContainer shown={gasInfo.gasPrice === 0}>
          <div
            className="text-[18px] leading-5 font-bold"
            style={{ color: gasPriceColor }}
          >
            {roundNumberWithSuffix(
              fromDripToGdrip(gasInfo.gasPrice, false, {
                precision: 1,
              }),
            )}{' '}
            Gdrip
          </div>
          <div className="text-[11px] leading-4 text-[#000] mt-[4px]">
            {`${t(translations.gaspriceDropdown.baseFee, {
              amount: roundNumberWithSuffix(
                fromDripToGdrip(gasInfo.base, false, {
                  precision: 1,
                }),
              ),
            })} | ${t(translations.gaspriceDropdown.maxPriorityFee, {
              amount: roundNumberWithSuffix(
                fromDripToGdrip(gasInfo.priority, false, {
                  precision: 1,
                }),
              ),
            })}`}
          </div>
        </SkeletonContainer>
      </div>
    </div>
  );
};

const refreshGasPrice = {
  init: false,
};
export const GasPriceDropdown = () => {
  const { t } = useTranslation();
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
        <SkeletonContainer
          shown={gasPriceData.gasPriceInfo.tp50.gasPrice === 0}
        >
          <img src={IconGas} alt="" />
          <span className="text-[var(--theme-color-primary)]">
            {roundNumberWithSuffix(
              fromDripToGdrip(gasPriceData.gasPriceInfo.tp50.gasPrice, false, {
                precision: 1,
              }),
            )}
          </span>
          <span>Gdrip</span>
        </SkeletonContainer>
      </div>
      {showModal && (
        <div className="modal animate-in fade-in w-full min-h-[fit-content] bg-[#FFF] fixed right-0 top-[53px] p-[16px] z-10 shadow-modal md:w-[474px] md:absolute md:top-[35px]">
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
            <GasInfoCard
              gasInfo={gasPriceData.gasPriceInfo.min}
              title={t(translations.gaspriceDropdown.low)}
              img={GasLow}
              gasPriceColor="#4ca960"
            />
            <GasInfoCard
              gasInfo={gasPriceData.gasPriceInfo.tp50}
              title={t(translations.gaspriceDropdown.median)}
              img={GasMedian}
              gasPriceColor="#395bd4"
            />
            <GasInfoCard
              gasInfo={gasPriceData.gasPriceInfo.max}
              title={t(translations.gaspriceDropdown.high)}
              img={GasHigh}
              gasPriceColor="#d74841"
            />
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
                  fromDripToGdrip(
                    gasPriceData.gasPriceMarket.tp25.gasPrice,
                    false,
                    {
                      precision: 1,
                    },
                  ),
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
                  fromDripToGdrip(
                    gasPriceData.gasPriceMarket.tp75.gasPrice,
                    false,
                    {
                      precision: 1,
                    },
                  ),
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
                    fromDripToGdrip(
                      gasPriceData.gasPriceMarket.min.gasPrice,
                      false,
                      {
                        precision: 1,
                      },
                    ),
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
                    fromDripToGdrip(
                      gasPriceData.gasPriceMarket.tp50.gasPrice,
                      false,
                      {
                        precision: 1,
                      },
                    ),
                  )}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[14px] text-[#9b9eac]">
                  Max
                </div>
                <div className="text-right text-[12px] font-semibold text-[#424a71]">
                  {roundNumberWithSuffix(
                    fromDripToGdrip(
                      gasPriceData.gasPriceMarket.max.gasPrice,
                      false,
                      {
                        precision: 1,
                      },
                    ),
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
