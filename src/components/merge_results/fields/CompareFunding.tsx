import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import RestoreIcon from '@mui/icons-material/Restore';
import { Divider } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Funding, Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { StyledCompareButton } from './CompareFiles';
import { FundingBox } from './FundingBox';

interface CompareFundingProps {
  sourceFunding?: Funding;
  targetFunding?: Funding;
  matchingTargetFundingIndex?: number;
}
export const CompareFunding = ({
  sourceFunding,
  targetFunding,
  matchingTargetFundingIndex = -1,
}: CompareFundingProps) => {
  const { t } = useTranslation();

  const { control } = useFormContext<Registration>();
  const { append, remove } = useFieldArray({ name: 'fundings', control });

  const canCopyFunding = !!sourceFunding && !targetFunding;
  const fundingIsCopied = matchingTargetFundingIndex > -1;

  return (
    <>
      <FundingBox funding={sourceFunding} />

      {canCopyFunding && (
        <StyledCompareButton
          data-testid={dataTestId.basicData.centralImport.copyValueButton}
          variant="contained"
          color="secondary"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => append(sourceFunding)}>
          {t('project.form.add_financing')}
        </StyledCompareButton>
      )}

      {fundingIsCopied && (
        <StyledCompareButton
          data-testid={dataTestId.basicData.centralImport.resetValueButton}
          variant="contained"
          color="tertiary"
          size="small"
          endIcon={<RestoreIcon />}
          onClick={() => remove(matchingTargetFundingIndex)}>
          {t('reset')}
        </StyledCompareButton>
      )}

      <FundingBox funding={targetFunding} />

      <Divider sx={{ display: { xs: 'block', md: 'none' }, my: '0.5rem' }} />
    </>
  );
};
