import { Contributor } from '../../../types/contributor.types';
import { StyledValueBox } from './MissingCompareValues';

interface ContributorBoxProps {
  contributor?: Contributor;
  sx?: object;
}

export const ContributorBox = ({ contributor, sx }: ContributorBoxProps) => {
  return <StyledValueBox sx={sx}>{contributor?.identity.name}</StyledValueBox>;
};
