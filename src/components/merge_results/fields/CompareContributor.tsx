import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import RestoreIcon from '@mui/icons-material/Restore';
import { Divider, Typography } from '@mui/material';
import { useContext } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../../types/contributor.types';
import { Registration } from '../../../types/registration.types';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { StyledCompareButton } from './CompareFiles';
import { ContributorBox } from './ContributorBox';
import { dataTestId } from '../../../utils/dataTestIds';

interface CompareContributorProps {
  sourceContributor?: Contributor;
  targetContributor?: Contributor;
  matchingTargetContributorIndex?: number;
}

export const CompareContributor = ({
  sourceContributor,
  targetContributor,
  matchingTargetContributorIndex = -1,
}: CompareContributorProps) => {
  const { t } = useTranslation();
  const { sourceHeading } = useContext(MergeResultsWizardContext);

  const { control } = useFormContext<Registration>();
  const { append, remove } = useFieldArray({ name: 'entityDescription.contributors', control });

  const canCopyContributor = !!sourceContributor && !targetContributor;
  const contributorIsCopied = matchingTargetContributorIndex > -1;

  return (
    <>
      <Typography variant="h3" sx={{ display: { xs: 'block', md: 'none' } }}>
        {sourceHeading}
      </Typography>
      <ContributorBox sx={{ gridColumn: 1 }} contributor={sourceContributor} />

      {canCopyContributor && (
        <StyledCompareButton
          data-testid={dataTestId.basicData.centralImport.copyValueButton}
          variant="contained"
          color="secondary"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => append(sourceContributor)}>
          {t('registration.contributors.add_contributor')}
        </StyledCompareButton>
      )}

      {contributorIsCopied && (
        <StyledCompareButton
          data-testid={dataTestId.basicData.centralImport.resetValueButton}
          variant="contained"
          color="tertiary"
          size="small"
          endIcon={<RestoreIcon />}
          onClick={() => remove(matchingTargetContributorIndex)}>
          {t('reset')}
        </StyledCompareButton>
      )}

      <Typography variant="h3" sx={{ display: { xs: 'block', md: 'none' } }}>
        {t('published_result')}
      </Typography>
      <ContributorBox sx={{ gridColumn: { xs: 1, md: 3 } }} contributor={targetContributor} />

      <Divider sx={{ display: { xs: 'block', md: 'none' }, my: '0.5rem' }} />
    </>
  );
};
