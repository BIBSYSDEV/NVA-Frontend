import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { ExportNviStatusLink } from '../../../pages/messages/components/ExportNviStatusLink';
import { dataTestId } from '../../../utils/dataTestIds';
import { formatLocaleNumber } from '../../../utils/general-helpers';
import { ExpandableNviTopView } from '../../ExpandableNviTopView';

interface NviPublicationPointsTextsProps {
  previousYear: number;
  isPending?: boolean;
  isError?: boolean;
  numApprovedByAll?: number;
  publicationPoints?: number;
  approvedPercentageComparedToPreviousYear?: number;
  exportAcronym?: string;
}

export const NviPublicationPointsTexts = ({
  previousYear,
  isPending = false,
  isError = false,
  numApprovedByAll,
  publicationPoints,
  approvedPercentageComparedToPreviousYear,
  exportAcronym,
}: NviPublicationPointsTextsProps) => {
  const { t } = useTranslation();

  return (
    <ExpandableNviTopView
      alwaysVisibleText={t('nvi_publication_points_page_description')}
      expandedText={t('nvi_publication_points_page_description_expanded')}
      testId={dataTestId.basicData.nvi.curatorPublicationPointsExpandDescriptionButton}>
      {isPending ? (
        <Skeleton sx={{ width: '50%' }} />
      ) : isError || numApprovedByAll === undefined || publicationPoints === undefined ? null : (
        <Trans
          t={t}
          i18nKey="nvi_approved_results_publication_points_summary"
          values={{
            num_approved_by_all: formatLocaleNumber(numApprovedByAll),
            publication_points: formatLocaleNumber(publicationPoints),
            percentage:
              approvedPercentageComparedToPreviousYear !== undefined
                ? formatLocaleNumber(approvedPercentageComparedToPreviousYear)
                : '–',
            year: previousYear,
          }}
          components={{
            p: <Typography sx={{ mt: '0.5rem' }} />,
            b: <Typography component="strong" sx={{ fontWeight: 'bold' }} />,
            link: exportAcronym ? <ExportNviStatusLink acronym={exportAcronym} /> : <span />,
          }}
        />
      )}
    </ExpandableNviTopView>
  );
};
