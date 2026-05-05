import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { BaseExpandableTextView } from '../../../../../components/_molecules/BaseExpandableTextView';
import { HorizontalBox, VerticalBox } from '../../../../../components/styled/Wrappers';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { formatLocaleNumber } from '../../../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../../../utils/hooks/useNviCandidatesParams';
import { ExportNviStatusLink } from '../../../../messages/components/ExportNviStatusLink';
import { HelperTextModal } from '../../../../registration/HelperTextModal';
import { useNviPeriodReportNumbers } from '../../components/hooks/useNviPeriodReportNumbers';

export const NviAdminPublicationPointsTexts = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const {
    isPending,
    isError,
    numApprovedByAll,
    publicationPoints,
    percentageApprovedComparedToPreviousYear: percentage,
  } = useNviPeriodReportNumbers(year);

  return (
    <BaseExpandableTextView
      alwaysVisibleText={t('publication_points_description')}
      expandedText={t('publication_points_description_more')}
      testId={dataTestId.basicData.nvi.publicationPointsExpandDescriptionButton}>
      <VerticalBox>
        {isPending ? (
          <Skeleton sx={{ width: '50%' }} />
        ) : isError || numApprovedByAll === undefined || publicationPoints === undefined ? undefined : (
          <HorizontalBox>
            <Trans
              i18nKey="nvi_admin_publication_points_numbers"
              values={{
                approvals: formatLocaleNumber(numApprovedByAll),
                publication_points: formatLocaleNumber(publicationPoints),
              }}
              components={{
                p: <Typography />,
                b: <strong />,
                link: <ExportNviStatusLink exportAllInstitutions />,
              }}
            />
            <HelperTextModal modalTitle={t('export_dataset_for_nvi_report')}>
              <Trans i18nKey="export_dataset_for_nvi_report_description" components={{ p: <Typography /> }} />
            </HelperTextModal>
          </HorizontalBox>
        )}
        {isPending ? (
          <Skeleton sx={{ width: '40%' }} />
        ) : isError ? undefined : (
          <Trans
            i18nKey="percent_of_published_reports_in_year"
            values={{
              percentage: percentage !== undefined ? formatLocaleNumber(percentage) : '–',
              year: year - 1,
            }}
            components={{
              p: <Typography gutterBottom />,
              b: <strong />,
            }}
          />
        )}
      </VerticalBox>
    </BaseExpandableTextView>
  );
};
