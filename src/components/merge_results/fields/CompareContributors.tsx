import { Typography } from '@mui/material';
import { useContext } from 'react';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { useFormContext, useWatch } from 'react-hook-form';
import { Registration } from '../../../types/registration.types';
import { CompareContributor } from './CompareContributor';

export const CompareContributors = () => {
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const { control } = useFormContext<Registration>();
  const sourceContributors = sourceResult.entityDescription?.contributors ?? [];
  const targetContributors = useWatch({ name: 'entityDescription.contributors', control }) ?? [];

  return <>{!!targetContributors && targetContributors.map((targetContributor) => {})}</>;
};
