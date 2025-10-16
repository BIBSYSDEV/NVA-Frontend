import { Contributor } from '../../../types/contributor.types';
import { ContributorBox } from './ContirbutorBox';

interface CompareContributorProps {
  sourceContributor?: Contributor;
  targetContributor?: Contributor;
}

export const CompareContributor = ({ sourceContributor, targetContributor }: CompareContributorProps) => {
  return (
    <>
      <ContributorBox sx={{ gridColumn: 1 }} contributor={sourceContributor} />
      <ContributorBox sx={{ gridColumn: { xs: 1, md: 3 } }} contributor={targetContributor} />
    </>
  );
};
