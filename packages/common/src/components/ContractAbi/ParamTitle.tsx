/**
 *
 * ParamTitle Component
 *
 */
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import imgInfo from '../../images/info.svg';
import { ArrowDown } from '../Icons';
import { useI18n } from 'src/store';
import { Text } from '../Text';
import clsx from 'clsx';

interface Props {
  name?: string;
  type?: string;
  expandable?: boolean;
  expand?: boolean;
  setExpand?: Dispatch<SetStateAction<boolean>>;
}

export const ParamTitle = ({
  name,
  type,
  expandable,
  expand,
  setExpand,
}: Props) => {
  const { t } = useTranslation();
  const { translations } = useI18n();
  let nameText = name || '<input>';
  return (
    <span className="inline-block text-14px text-#002257 lh-22px mt-8px">
      {nameText}
      {type !== 'cfx' && (
        <span>
          &nbsp;(<i>{type}</i>)
        </span>
      )}
      {(type + '').startsWith('tuple') ? (
        <Text
          tag="span"
          hoverValue={
            <span
              className="inputComp-tip"
              dangerouslySetInnerHTML={{
                __html: t(translations.contract.tupleTips),
              }}
            />
          }
        >
          <img src={imgInfo} alt="tips" className="w-16px h-16px ml-8px" />
        </Text>
      ) : null}
      {expandable && (
        <ArrowDown
          className={clsx(
            `w-16px -mt-3px ml-5px cursor-pointer transition-transform-300`,
            expand && 'rotate-180',
          )}
          onClick={() => setExpand?.(e => !e)}
        />
      )}
    </span>
  );
};
