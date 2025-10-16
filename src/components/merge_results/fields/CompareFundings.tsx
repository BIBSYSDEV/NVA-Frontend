import { Typography } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../../types/registration.types';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { FundingBox } from './FundingBox';

export const ComapreFundings = () => {
  const { t } = useTranslation();

  const { control } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceFundings = sourceResult.fundings;

  const targetFundings = useWatch({ name: 'fundings', control });

  return (
    <>
      <Typography variant="h4" sx={{ display: { xs: 'none', md: 'block' } }}>
        {t('common.funding')}
      </Typography>
      <Typography variant="h4" sx={{ gridColumn: { xs: 1, md: 3 } }}>
        {t('common.funding')}
      </Typography>

      <div>
        {sourceFundings.map((funding) => {
          return <FundingBox key={funding.identifier} funding={funding} />;
        })}
      </div>

      <div />

      <div>
        {targetFundings.map((funding) => {
          return <FundingBox key={funding.identifier} funding={funding} />;
        })}
      </div>
    </>
  );
};
