import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { ExportNviStatusLink } from '../../../pages/messages/components/ExportNviStatusLink';
import { formatLocaleNumber } from '../../../utils/general-helpers';
import { ExpandableNviTopView } from '../../ExpandableNviTopView';
import { VerticalBox } from '../../styled/Wrappers';
import { variantConfig } from './top-text-config';
import { NviTopTextViewVariant, PublicationPointsNumbers } from './top-text-types';

interface NviPublicationPointsTopTextProps {
  variant: NviTopTextViewVariant;
  isPending: boolean;
  isError: boolean;
  numbers?: PublicationPointsNumbers;
  exportAcronym?: string;
}

export const NviPublicationPointsTexts = ({
  variant,
  isPending,
  isError,
  numbers,
  exportAcronym,
}: NviPublicationPointsTopTextProps) => {
  const { t } = useTranslation();
  const { alwaysVisibleTextKey, expandedTextKey, testId } = variantConfig[variant];
  const alwaysVisibleText = t(alwaysVisibleTextKey);
  const expandedText = t(expandedTextKey);

  return (
    <ExpandableNviTopView alwaysVisibleText={alwaysVisibleText} expandedText={expandedText} testId={testId}>
      <VerticalBox sx={{ gap: '0.25rem', mt: '1rem' }}>
        {isPending ? (
          <Skeleton sx={{ width: '50%' }} />
        ) : isError || !numbers ? undefined : (
          <Trans
            i18nKey="x_results_are_ready_for_reporting_and_they_give_y_publication_points_that_is_z_percent_of_year"
            values={{
              num_results_approved_by_all: formatLocaleNumber(numbers.totalCount),
              total_publicationpoints: formatLocaleNumber(numbers.validPoints),
              percentage: numbers.percentageComparedToYearBefore,
              year: numbers.yearBefore,
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
