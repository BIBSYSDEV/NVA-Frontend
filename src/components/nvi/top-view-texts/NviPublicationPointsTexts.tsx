import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { ExportNviStatusLink } from '../../../pages/messages/components/ExportNviStatusLink';
import { dataTestId } from '../../../utils/dataTestIds';
import { formatLocaleNumber } from '../../../utils/general-helpers';
import { ExpandableNviTopView } from '../../ExpandableNviTopView';
import { VerticalBox } from '../../styled/Wrappers';
import { NviTopTextViewVariant } from './top-text-types';

interface NviPublicationPointsTopTextProps {
  variant: NviTopTextViewVariant;
  isPending: boolean;
  isError: boolean;
  totalCount?: number;
  percentageComparedToYearBefore?: number;
  validPoints?: number;
  yearBefore?: number;
  exportAcronym?: string;
}

export const NviPublicationPointsTexts = ({
  variant,
  isPending,
  isError,
  totalCount,
  percentageComparedToYearBefore,
  validPoints,
  yearBefore,
  exportAcronym,
}: NviPublicationPointsTopTextProps) => {
  const { t } = useTranslation();
  const isAdmin = variant === NviTopTextViewVariant.Admin;

  return (
    <ExpandableNviTopView
      alwaysVisibleText={
        isAdmin ? t('nvi_publication_points_description_admin') : t('nvi_publication_points_description')
      }
      expandedText={
        isAdmin ? 'nvi_publication_points_description_admin_more' : t('nvi_publication_points_description_more')
      }
      testId={
        isAdmin
          ? dataTestId.basicData.nvi.publicationPointsExpandDescriptionButton
          : dataTestId.basicData.nvi.curatorPublicationPointsExpandDescriptionButton
      }>
      <VerticalBox sx={{ gap: '0.25rem', mt: '1rem' }}>
        {isPending ? (
          <Skeleton sx={{ width: '50%' }} />
        ) : isError || !totalCount || !percentageComparedToYearBefore || !validPoints ? undefined : (
          <Trans
            i18nKey="x_results_are_ready_for_reporting_and_they_give_y_publication_points_that_is_z_percent_of_year"
            values={{
              num_results_approved_by_all: formatLocaleNumber(totalCount),
              total_publicationpoints: formatLocaleNumber(validPoints),
              percentage: percentageComparedToYearBefore,
              year: yearBefore,
            }}
            components={{
              b: <strong />,
              p: <Typography gutterBottom />,
              link: exportAcronym ? <ExportNviStatusLink acronym={exportAcronym} /> : <span />,
            }}
          />
        )}
      </VerticalBox>
    </ExpandableNviTopView>
  );
};
