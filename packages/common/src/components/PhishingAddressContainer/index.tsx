import { getTranslations } from 'src/store';
import { Tooltip } from '../Tooltip';
import { PhishingWarningIcon } from './PhishingWarningIcon';
import { Trans } from 'react-i18next';
import { useMemo } from 'react';
import { convertCheckSum } from 'src/utils/address';

export interface PhishingData {
  key: string;
  regex: RegExp;
  list: {
    address: string;
    list: [string, string, string];
  }[];
}

export const formatListResponseWithPhishingInfo = <
  T extends Record<string, unknown>,
>(
  response: T,
) => {
  if (!response || !response.phishingInfo || !response.list) {
    return response;
  }
  const phishingInfo = response.phishingInfo as Record<string, string[]>;
  const phishingRegex = Object.keys(phishingInfo).reduce((acc, key) => {
    const value = phishingInfo[key] || [];
    if (!Array.isArray(value) || value.length <= 1) {
      return acc;
    }
    const [start = '', end = ''] = key.split('...');
    const regex = new RegExp(`^(${start})(.*)(${end})$`, 'i');
    acc.push({
      key,
      regex,
      list: value.map(item => {
        const [_, start = '', middle = '', end = ''] =
          convertCheckSum(item).match(regex) || [];
        return {
          address: item,
          list: [start, middle, end],
        };
      }),
    });
    return acc;
  }, [] as PhishingData[]);
  if (phishingRegex.length === 0) {
    return response;
  }
  return {
    ...response,
    list: (response.list as Record<string, unknown>[]).map(item => {
      const fromPhishingData = phishingRegex.find(p =>
        p.regex.test((item.from || '') as string),
      );
      const toPhishingData = phishingRegex.find(p =>
        p.regex.test((item.to || '') as string),
      );
      return {
        ...item,
        fromPhishingData,
        toPhishingData,
      };
    }),
  };
};

const PhishingAddress: React.FC<{
  start: string;
  end: string;
  middle: string;
}> = ({ start, end, middle }) => {
  return (
    <span>
      <span className="text-#FFBB37">{start}</span>
      <span>{middle}</span>
      <span className="text-#FFBB37">{end}</span>
    </span>
  );
};

const SimilarAddresses: React.FC<{
  list: [string, string, string][];
}> = ({ list }) => {
  return (
    <div className="flex flex-col">
      {list.map(item => (
        <PhishingAddress
          key={item[1]}
          start={item[0]}
          end={item[2]}
          middle={item[1]}
        />
      ))}
    </div>
  );
};

const PhishingTooltip: React.FC<{
  phishingData: PhishingData;
  address: string;
}> = ({ phishingData, address }) => {
  const translations = getTranslations();
  const { list: _list, key, regex } = phishingData;
  const { start, middle, end, list } = useMemo(() => {
    const [_, start = '', middle = '', end = ''] =
      convertCheckSum(address).match(regex) || [];
    return {
      start,
      middle,
      end,
      list: _list
        .filter(item => item.address.toLowerCase() !== address.toLowerCase())
        .map(item => item.list),
    };
  }, [address, key, _list]);

  return (
    <Tooltip
      className="flex items-center"
      containerClassName="[&.sirius-next-tooltip>[data-part=content]]:text-10px"
      title={
        <Trans i18nKey={translations.toolTip.phishingWarning}>
          <PhishingAddress start={start} end={end} middle={middle} />
          <SimilarAddresses list={list} />
        </Trans>
      }
      portalled
    >
      <PhishingWarningIcon className="text-#FFBB37" />
    </Tooltip>
  );
};

export const PhishingAddressContainer: React.FC<
  React.PropsWithChildren & {
    address?: string;
    phishingData?: PhishingData;
  }
> = ({ children, phishingData, address }) => {
  if (address && phishingData && phishingData.list.length > 0) {
    return (
      <div className="flex items-center">
        <PhishingTooltip phishingData={phishingData} address={address} />
        {children}
      </div>
    );
  }
  return children;
};
