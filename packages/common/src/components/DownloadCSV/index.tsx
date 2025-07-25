import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTranslations } from '../../store';
import { Link } from '../Link';
import { Modal } from '../Modal';
import ReCAPTCHA from 'react-google-recaptcha';
import iconInfo from '../../images/info.svg';
import { Tooltip } from '../Tooltip';

export const DownloadCSV = ({ url: outerUrl }: { url: string }) => {
  const { t, i18n } = useTranslation();
  const [recaptchaVisible, setRecaptchaVisible] = useState(false);
  const translations = getTranslations();

  const handleRecaptchaModalClose = () => setRecaptchaVisible(false);
  const onRecaptchaChange = (value: string | null) => {
    if (value) {
      // download csv file
      window.open(outerUrl);

      setRecaptchaVisible(false);
    }
  };
  const handleDownloadCSV = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setRecaptchaVisible(true);
  };

  return (
    <div className="text-right mb-[-1rem]">
      <Tooltip
        className="inline-block pr-[0.2857rem] w-[1.2857rem] cursor-pointer"
        title={t(translations.general.downloadCSV.latest5000records)}
      >
        <img
          src={iconInfo}
          alt="warning-icon"
          className="mt-[-0.2857rem]"
        ></img>
      </Tooltip>
      <span>{t(translations.general.downloadCSV.download)} </span>
      <Link onClick={handleDownloadCSV}>
        {t(translations.general.downloadCSV.csvFile)}
      </Link>
      <Modal
        open={recaptchaVisible}
        onClose={handleRecaptchaModalClose}
        closable
        width={'26.0714rem'}
      >
        <ReCAPTCHA
          sitekey="6Lf4-wYrAAAAAEyOeqFdmh124oUt4PjJSEVNk3NK"
          onChange={onRecaptchaChange}
          hl={i18n.language.indexOf('en') > -1 ? 'en' : 'zh'}
        />
      </Modal>
    </div>
  );
};
