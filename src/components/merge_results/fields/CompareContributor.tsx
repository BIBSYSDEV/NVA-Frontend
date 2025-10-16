import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../../types/contributor.types';

interface CompareContributorProps {
  sourceContributor?: Contributor;
  targetContributor?: Contributor;
}

export const CompareContributor = ({ sourceContributor, targetContributor }: CompareContributorProps) => {
  const { t } = useTranslation();

  return (
    <>
      <ContributorBox sx={{ gridColumn: 1 }} contributor={sourceContributor} />
      <ContributorBox sx={{ gridColumn: { xs: 1, md: 3 } }} contributor={targetContributor} />
    </>
  );
};

interface ContributorBoxProps {
  contributor?: Contributor;
  sx?: object;
}

const ContributorBox = ({ contributor, sx }: ContributorBoxProps) => {
  return <Box sx={sx}>{contributor?.identity.name}</Box>;
};
