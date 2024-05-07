import { Translation } from 'react-i18next';
import { Bookmark, Hash } from '@zeit-ui/react-icons';
import { Tooltip } from '../Tooltip';
import { getTranslations } from '../../store';
import ICON_ENS from '../../images/logo-cns.svg';

export const getLabelInfo = (label: string, type: string) => {
  const translations = getTranslations();
  if (label) {
    let trans: string = '';
    let icon: React.ReactNode = null;

    if (type === 'tag') {
      trans = translations.profile.tip.label;
      icon = <Bookmark color="var(--theme-color-gray2)" size={16} />;
    } else if (type === 'ens') {
      trans = (translations as any).ens.label;
      icon = (
        <img
          src={ICON_ENS}
          className="w-[16px] h-[16px] mb-[3px] mr-[2px]"
          alt=""
        />
      );
      // nametag from official operational staff
    } else if (type === 'nametag') {
      trans = translations.nametag.label;
      icon = <Hash color="var(--theme-color-gray2)" size={16} />;
    }

    return {
      label,
      icon: (
        <div className="mr-[2px]">
          <Tooltip title={<Translation>{t => t(trans)}</Translation>}>
            {icon}
          </Tooltip>
        </div>
      ),
    };
  }

  return {
    label: '',
    icon: null,
  };
};
