import { Divider, Typography } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Funding, Registration } from '../../../types/registration.types';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { MissingCompareValues } from './MissingCompareValues';
import { fundingSourceIsNfr } from '../../../pages/registration/description_tab/projects_field/projectHelpers';
import { CompareFunding } from './CompareFunding';

const isMatchingFundings = (sourceFunding: Funding, targetFunding: Funding) => {
  if (fundingSourceIsNfr(sourceFunding.source) && fundingSourceIsNfr(targetFunding.source)) {
    if (sourceFunding.id === targetFunding.id) {
      return true;
    }

    if (
      sourceFunding.source === targetFunding.source &&
      sourceFunding.identifier === targetFunding.identifier &&
      sourceFunding.fundingAmount?.amount === targetFunding.fundingAmount?.amount
    ) {
      return true;
    }
  }

  return false;
};

export const CompareFundings = () => {
  const { t } = useTranslation();

  const { control, formState } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceFundings = sourceResult.fundings ?? [];

  const targetFundings = useWatch({ name: 'fundings', control }) ?? [];
  const initiaTargetFundings = (formState.defaultValues?.fundings ?? []) as Funding[];

  const commonFundings = sourceFundings.filter((sourceFunding) =>
    initiaTargetFundings.some((targetFunding) => isMatchingFundings(sourceFunding, targetFunding))
  );

  const targetOnlyFundings = targetFundings.filter(
    (targetFunding) => !commonFundings.some((commonFunding) => isMatchingFundings(targetFunding, commonFunding))
  );

  const addableSourceFundings = sourceFundings.filter(
    (sourceFunding) => !commonFundings.some((commonFunding) => isMatchingFundings(sourceFunding, commonFunding))
  );

  return (
    <>
      <Typography variant="h4" sx={{ display: { xs: 'none', md: 'block' } }}>
        {t('common.funding')}
      </Typography>
      <Typography variant="h4" sx={{ gridColumn: { xs: 1, md: 3 } }}>
        {t('common.funding')}
      </Typography>

      {initiaTargetFundings.length === 0 && sourceFundings.length === 0 && <MissingCompareValues />}

      {targetOnlyFundings.map((funding) => (
        <CompareFunding key="1" targetFunding={funding} />
      ))}

      {commonFundings.map((funding) => (
        <CompareFunding key="2" sourceFunding={funding} targetFunding={funding} />
      ))}

      {addableSourceFundings.map((funding) => {
        const matchingTargetFundingIndex = targetFundings.findIndex((targetFunding) =>
          isMatchingFundings(targetFunding, funding)
        );
        const matchingTargetFunding =
          matchingTargetFundingIndex > -1 ? targetFundings[matchingTargetFundingIndex] : undefined;
        return (
          <CompareFunding
            key={funding.identifier}
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
