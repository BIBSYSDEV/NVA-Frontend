import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { ExportNviStatusLink } from '../../../pages/messages/components/ExportNviStatusLink';
import { HelperTextModal } from '../../../pages/registration/HelperTextModal';
import { formatLocaleNumber } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { HorizontalBox, VerticalBox } from '../../styled/Wrappers';
import { useNviPeriodReportNumbers } from '../hooks/useNviPeriodReportNumbers';

export const NviAdminReportingStatusTexts = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const {
    isPending,
    isError,
    numCandidatesForReporting,
    percentageCandidatesComparedToPreviousYear: percentage,
  } = useNviPeriodReportNumbers(year);

  return (
    <VerticalBox sx={{ mb: '1rem', gap: '0.5rem' }}>
      <Trans t={t} i18nKey="basic_data.nvi.reporting_status_description" components={{ p: <Typography /> }} />
      {isPending ? (
        <Skeleton sx={{ width: '50%' }} />
      ) : isError || numCandidatesForReporting === undefined ? null : (
        <Trans
          t={t}
          i18nKey="nvi_admin_reporting_status_numbers"
          values={{
            num_results: formatLocaleNumber(numCandidatesForReporting),
            percentage: percentage !== undefined ? formatLocaleNumber(percentage) : '–',
            previous_year: year - 1,
          }}
          components={{
            p: <Typography />,
            b: <strong />,
          }}
        />
      )}
      <HorizontalBox sx={{ mt: '1rem', alignItems: 'center' }}>
        <ExportNviStatusLink exportAllInstitutions text={t('export_data_for_nvi_control')} sx={{ pl: 0 }} />
        <HelperTextModal modalTitle={t('export_data_for_nvi_control')}>
          <VerticalBox sx={{ gap: '1rem' }}>
            <Trans i18nKey="export_data_for_nvi_control_description" components={{ p: <Typography /> }} />
          </VerticalBox>
        </HelperTextModal>
      </HorizontalBox>
    </VerticalBox>
  );
};
