import { WithTranslation } from 'react-i18next';
import { AlertTriangle, File } from '@zeit-ui/react-icons';
import InternalContractIcon from '../../images/internal-contract-icon.png';
import ContractIcon from '../../images/contract-icon.png';
import VerifiedIcon from '../../images/verified.png';
import isMeIcon from '../../images/me.png';
import { Tooltip } from '../Tooltip';
import { isPosAddress } from '@cfx-kit/dapp-utils/dist/address';
import { formatAddress, isInnerContractAddress } from '../../utils/address';
import { getTranslations, getEnvConfig, useGlobalData } from '../../store';
import { getNetwork, formatString, coreCorrespondsToEspace } from 'src/utils';
import { Props } from './types';
import { RenderAddress } from './addressView';

// common
export const ContractCreatedAddress = (
  props: Props & WithTranslation & { outputType: 'hex' | 'base32' },
) => {
  const { contractCreated = '', outputType, t, isFull } = props;

  const translations = getTranslations();

  const contractAddress = formatAddress(contractCreated, outputType);

  const customProps = {
    content: t(translations.transaction.contractCreation),
    alias: t(translations.transaction.contractCreation),
    hrefAddress: contractAddress,
    cfxAddress: contractAddress,
    maxWidth: 160,
  };

  const mergedProps = { ...props, ...customProps };
  return RenderAddress({
    ...mergedProps,
    prefix: (
      <div className={`mr-[2px] flex-shrink-0 ${isFull ? 'icon' : ''}`}>
        <Tooltip title={mergedProps.content}>
          <div className="relative w-[16px] h-[16px]">
            <img
              className="w-[16px] h-[16px] align-bottom mb-[3px]"
              src={ContractIcon}
              alt={mergedProps.content}
            />
          </div>
        </Tooltip>
      </div>
    ),
  });
};

// core
export const CoreHexAddress = (props: Props & WithTranslation) => {
  const { value, t, isFull, maxWidth } = props;
  const { globalData } = useGlobalData();

  const ENV_CONFIG = getEnvConfig();
  const translations = getTranslations();
  const hexAddress = formatAddress(value, 'hex');
  const network = getNetwork(
    globalData?.networks,
    coreCorrespondsToEspace(ENV_CONFIG.ENV_NETWORK_ID),
  );
  const url = `${network.url}/address/${hexAddress}`;

  return RenderAddress({
    cfxAddress: hexAddress,
    hoverValue: hexAddress,
    link: url,
    isFull,
    maxWidth,
    suffixSize: 0,
    prefix: (
      <div className="mr-[2px] flex-shrink-0">
        <Tooltip title={t((translations as any).general.eSpaceAddress)}>
          <File size={16} color="#17B38A" />
        </Tooltip>
      </div>
    ),
  });
};

// common
export const InvalidAddress = (props: Props & WithTranslation) => {
  const {
    value,
    alias,
    t,
    isFull,
    maxWidth,
    isFullNameTag,
    hideAliasPrefixInHover,
  } = props;

  const translations = getTranslations();

  const tip = t(translations.general.invalidAddress);

  return RenderAddress({
    cfxAddress: value,
    alias,
    hoverValue: `${tip}: ${value}`,
    content: alias ? formatString(alias, 'tag') : value,
    link: false,
    isFull,
    isFullNameTag,
    maxWidth,
    style: { color: '#e00909' },
    prefix: (
      <div className="mr-[2px] flex-shrink-0">
        <Tooltip title={tip}>
          <AlertTriangle size={16} color="#e00909" />
        </Tooltip>
      </div>
    ),
    hideAliasPrefixInHover,
  });
};

// common
export const ContractAddress = (props: Props & WithTranslation) => {
  const { showIcon, verify, t, cfxAddress, isFull } = props;

  const translations = getTranslations();

  const isInnerContract = cfxAddress && isInnerContractAddress(cfxAddress);

  const typeText = t(
    isInnerContract
      ? translations.general.internalContract
      : verify
        ? translations.general.verifiedContract
        : translations.general.unverifiedContract,
  );

  return RenderAddress({
    ...props,
    prefix: showIcon ? (
      <div className={`mr-[2px] flex-shrink-0 ${isFull ? 'icon' : ''}`}>
        <Tooltip title={typeText}>
          <div className="relative w-[16px] h-[16px]">
            {isInnerContract ? (
              <img
                className="w-[16px] h-[16px] align-bottom mb-[5px]"
                src={InternalContractIcon}
                alt={typeText}
              />
            ) : (
              <>
                <img
                  className="w-[16px] h-[16px] align-bottom mb-[5px]"
                  src={ContractIcon}
                  alt={typeText}
                />
                {verify ? (
                  <img
                    className="w-[8px] h-[8px] absolute bottom-[-1px] right-[1px]"
                    src={VerifiedIcon}
                    alt={''}
                  />
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </Tooltip>
      </div>
    ) : (
      <></>
    ),
  });
};

// common
export const MyAddress = (props: Props & WithTranslation) => {
  const { isFull } = props;
  return RenderAddress({
    ...props,
    suffix: (
      <div className="mr-[2px] flex-shrink-0">
        <img
          className="w-[38.5px] h-[16px] ml-[3px] align-bottom"
          src={isMeIcon}
          alt="is me"
          style={{
            marginBottom: isFull ? '6px' : '4px',
          }}
        />
      </div>
    ),
  });
};

// core
export const PosAddress = (props: Props & WithTranslation) => {
  const {
    alias,
    isFull,
    isFullNameTag,
    maxWidth,
    t,
    link,
    isMe,
    hideAliasPrefixInHover,
  } = props;
  const value = props.value;
  if (!value) {
    return <>--</>;
  }
  if (isMe) {
    return MyAddress(props);
  }
  const translations = getTranslations();
  const content = alias
    ? formatString(alias, 'tag')
    : formatString(value, 'posAddress');
  if (!isPosAddress(value)) {
    const tip = t(translations.general.invalidPosAddress);
    return RenderAddress({
      cfxAddress: value,
      alias,
      hoverValue: `${tip}: ${value}`,
      content,
      link: false,
      isFull,
      isFullNameTag,
      maxWidth,
      style: { color: '#e00909' },
      prefix: (
        <div className="mr-[2px] flex-shrink-0">
          <Tooltip title={tip}>
            <AlertTriangle size={16} color="#e00909" />
          </Tooltip>
        </div>
      ),
      type: 'pos',
      hideAliasPrefixInHover,
    });
  }

  return RenderAddress({
    cfxAddress: value,
    alias,
    link,
    isFull,
    isFullNameTag,
    maxWidth,
    type: 'pos',
    content,
    hideAliasPrefixInHover,
  });
};
