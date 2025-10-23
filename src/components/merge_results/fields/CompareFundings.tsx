import { Divider, Typography } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Funding, Registration } from '../../../types/registration.types';
import { isMatchingFundings } from '../merge-results-helpers';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { CompareFunding } from './CompareFunding';
import { MissingCompareValues } from './MissingCompareValues';

export const CompareFundings = () => {
  const { t } = useTranslation();

  const { control, formState } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceFundings = sourceResult.fundings ?? [];

  const targetFundings = useWatch({ name: 'fundings', control }) ?? [];
  const initialTargetFundings = (formState.defaultValues?.fundings ?? []) as Funding[];

  const commonFundings = sourceFundings.filter((sourceFunding) =>
    initialTargetFundings.some((targetFunding) => isMatchingFundings(sourceFunding, targetFunding))
  );

  const targetOnlyFundings = initialTargetFundings.filter(
    (targetFunding) => !commonFundings.some((sourceFunding) => isMatchingFundings(sourceFunding, targetFunding))
  );

  const addableSourceFundings = sourceFundings.filter(
    (sourceFunding) => !commonFundings.some((targetFunding) => isMatchingFundings(sourceFunding, targetFunding))
  );

  return (
    <>
      <Typography variant="h4" sx={{ display: { xs: 'none', md: 'block' } }}>
        {t('common.funding')}
      </Typography>
      <Typography variant="h4" sx={{ gridColumn: { xs: 1, md: 3 } }}>
        {t('common.funding')}
      </Typography>

      {initialTargetFundings.length === 0 && sourceFundings.length === 0 && <MissingCompareValues />}

      {targetOnlyFundings.map((funding) => (
        <CompareFunding key={funding.source + funding.identifier} targetFunding={funding} />
      ))}

      {commonFundings.map((funding) => (
        <CompareFunding key={funding.source + funding.identifier} sourceFunding={funding} targetFunding={funding} />
      ))}

      {addableSourceFundings.map((funding) => {
        const matchingTargetFundingIndex = targetFundings.findIndex((targetFunding) =>
          isMatchingFundings(targetFunding, funding)
        );
        const matchingTargetFunding =
          matchingTargetFundingIndex > -1 ? targetFundings[matchingTargetFundingIndex] : undefined;
        return (
          <CompareFunding
            key={funding.source + funding.identifier}
            sourceFunding={funding}
            targetFunding={matchingTargetFunding}
            matchingTargetFundingIndex={matchingTargetFundingIndex}
          />
        );
      })}

      <Divider sx={{ gridColumn: '1/-1', my: '0.5rem', display: { xs: 'none', md: 'block' } }} />
    </>
  );
};
