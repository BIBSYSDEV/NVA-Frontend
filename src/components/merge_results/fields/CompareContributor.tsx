import { Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../../types/contributor.types';
import { isOnImportPage } from '../../../utils/urlPaths';
import { ContributorBox } from './ContributorBox';

interface CompareContributorProps {
  sourceContributor?: Contributor;
  targetContributor?: Contributor;
}

export const CompareContributor = ({ sourceContributor, targetContributor }: CompareContributorProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h3" sx={{ display: { xs: 'block', md: 'none' } }}>
        {isOnImportPage() ? t('basic_data.central_import.import_candidate') : t('unpublished_result')}
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
