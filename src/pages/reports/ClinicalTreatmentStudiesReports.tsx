import { useTranslation } from 'react-i18next';
import { StyledReportIframe } from './NviReports';

export const ClinicalTreatmentStudiesReports = () => {
  const { t } = useTranslation();

  return (
    <StyledReportIframe
      title={t('search.reports.clinical_treatment_studies')}
      allow="fullscreen"
      src="https://app.powerbi.com/view?r=eyJrIjoiZDBhN2ExMjMtODRhMC00YzRmLWExMDctMjAzZDQyYjRiM2E0IiwidCI6ImNiMzQyMTQ2LTc5NjUtNDI1ZS04M2FiLTg4ZjhlY2I5OWUwZCJ9"
    />
  );
};
