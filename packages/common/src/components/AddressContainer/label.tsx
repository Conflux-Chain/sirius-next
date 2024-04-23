import { AlertTriangle, File, Bookmark, Hash } from '@zeit-ui/react-icons';
import ICON_ENS from 'images/logo-cns.svg';
import { useI18n } from '../../store';

export const getLabelInfo = (label: string, type: string) => {
  const { translations } = useI18n();
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
          style={{
            marginBottom: '3px',
            marginRight: '2px',
          }}
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
        <IconWrapper>
          <Text span hoverValue={<Translation>{t => t(trans)}</Translation>}>
            {icon}
          </Text>
        </IconWrapper>
      ),
    };
  }

  return {
    label: '',
    icon: null,
  };
};
