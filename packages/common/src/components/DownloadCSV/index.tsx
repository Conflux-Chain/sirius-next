import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTranslations } from '../../store';
import { Link } from '../Link';
import { Modal } from '../Modal';
import ReCAPTCHA from 'react-google-recaptcha';
import iconInfo from '../../images/info.svg';
import { Tooltip } from '../Tooltip';
import qs from 'qs';

export const DownloadCSV = ({ url: outerUrl }: { url: string }) => {
  const { t, i18n } = useTranslation();
  const [recaptchaVisible, setRecaptchaVisible] = useState(false);
  const translations = getTranslations();

  const handleRecaptchaModalClose = () => setRecaptchaVisible(false);
  const onRecaptchaChange = (value: string | null) => {
    if (value) {
      const parsedUrl = new URL(outerUrl, window.location.origin);
      const query = qs.parse(parsedUrl.search, { ignoreQueryPrefix: true });

      query.token = value;

      const newUrl = `${parsedUrl.origin}${parsedUrl.pathname}?${qs.stringify(query)}`;

      window.open(newUrl);

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
          sitekey="6LeSnTofAAAAAML11Df2KzLagoDb59fhVWb8ENSc"
          onChange={onRecaptchaChange}
          hl={i18n.language.indexOf('en') > -1 ? 'en' : 'zh'}
        />
      </Modal>
    </div>
  );
};
