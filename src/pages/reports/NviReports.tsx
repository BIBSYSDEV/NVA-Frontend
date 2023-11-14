import { useTranslation } from 'react-i18next';

export const NviReports = () => {
  const { t } = useTranslation();

  return (
    <iframe
      style={{ border: 'none', height: '60vh' }}
      title={t('common.nvi')}
      width="100%"
      src="https://rapport-dv.uhad.no/t/DUCT/views/nettsider_2022_14_04_v2/NVI2011-2022?%3Aembed=y&%3AloadOrderID=0&%3Adisplay_spinner=yes&%3AshowAppBanner=false&%3Atoolbar=yes&%3Atabs=no"
    />
  );
};
