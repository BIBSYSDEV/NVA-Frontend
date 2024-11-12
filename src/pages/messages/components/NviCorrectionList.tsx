import { useTranslation } from 'react-i18next';

export const NviCorrectionList = () => {
  const { t } = useTranslation();

  return (
    <iframe
      style={{ border: 'none', height: '80vh' }}
      title={t('tasks.correction_list')}
      width="100%"
      src="https://rapport-dv.uhad.no/t/DUCT/views/Ryddelister_2023/Rettelister2023?%3Aembed=y"
    />
  );
};
