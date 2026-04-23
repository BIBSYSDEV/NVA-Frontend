import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { ExportNviStatusLink } from '../../../pages/messages/components/ExportNviStatusLink';
import { HelperTextModal } from '../../../pages/registration/HelperTextModal';
import { dataTestId } from '../../../utils/dataTestIds';
import { formatLocaleNumber } from '../../../utils/general-helpers';
import { ExpandableNviTopView } from '../../ExpandableNviTopView';
import { HorizontalBox, VerticalBox } from '../../styled/Wrappers';

interface NviAdminPublicationPointsTextsProps {
  previousYear?: number;
  numApprovals?: number;
  publicationPoints?: number;
  percentage?: number;
  isPending?: boolean;
  isError?: boolean;
}

export const NviAdminPublicationPointsTexts = ({
  previousYear,
  isPending = false,
  isError = false,
  numApprovals,
  percentage,
  publicationPoints,
}: NviAdminPublicationPointsTextsProps) => {
  const { t } = useTranslation();

  return (
    <ExpandableNviTopView
      alwaysVisibleText={t('publication_points_description')}
      expandedText={t('publication_points_description_more')}
      testId={dataTestId.basicData.nvi.publicationPointsExpandDescriptionButton}>
      <VerticalBox>
        {isPending ? (
          <Skeleton sx={{ width: '50%' }} />
        ) : isError || numApprovals === undefined || publicationPoints === undefined ? undefined : (
          <HorizontalBox>
            <Trans
              i18nKey="nvi_admin_publication_points_numbers"
              values={{
                approvals: formatLocaleNumber(numApprovals),
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
              year: previousYear,
            }}
            components={{
              p: <Typography gutterBottom />,
              b: <strong />,
            }}
          />
        )}
      </VerticalBox>
    </ExpandableNviTopView>
  );
};
