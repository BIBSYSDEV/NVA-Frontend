import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { HeadTitle } from '../../components/HeadTitle';
import { StyledReportIframe } from './NviReports';

const ClinicalTreatmentStudiesReports = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadTitle>{t('search.reports.clinical_treatment_studies')}</HeadTitle>
      <Typography variant="h1" sx={visuallyHidden}>
        {t('search.reports.clinical_treatment_studies')}
      </Typography>
      <StyledReportIframe
        title={t('search.reports.clinical_treatment_studies')}
        src="https://app.powerbi.com/view?r=eyJrIjoiZDBhN2ExMjMtODRhMC00YzRmLWExMDctMjAzZDQyYjRiM2E0IiwidCI6ImNiMzQyMTQ2LTc5NjUtNDI1ZS04M2FiLTg4ZjhlY2I5OWUwZCJ9"
      />
    </>
  );
};

export default ClinicalTreatmentStudiesReports;
