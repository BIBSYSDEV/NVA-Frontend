import { Divider, Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../../types/contributor.types';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { ContributorBox } from './ContributorBox';

interface CompareContributorProps {
  sourceContributor?: Contributor;
  targetContributor?: Contributor;
}

export const CompareContributor = ({ sourceContributor, targetContributor }: CompareContributorProps) => {
  const { t } = useTranslation();
  const { sourceHeading } = useContext(MergeResultsWizardContext);

  return (
    <>
      <Typography variant="h3" sx={{ display: { xs: 'block', md: 'none' } }}>
        {sourceHeading}
      </Typography>
      <ContributorBox sx={{ gridColumn: 1 }} contributor={sourceContributor} />

      <Typography variant="h3" sx={{ display: { xs: 'block', md: 'none' } }}>
        {t('published_result')}
      </Typography>
      <ContributorBox sx={{ gridColumn: { xs: 1, md: 3 } }} contributor={targetContributor} />

      <Divider sx={{ display: { xs: 'block', md: 'none' }, my: '0.5rem' }} />
    </>
  );
};
