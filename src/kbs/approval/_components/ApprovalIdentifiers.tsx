import { Typography } from '@mui/material';
import { Approval } from '../approval.types';

interface ApprovalIdentifiersProps {
  identifiers: Approval['identifiers'];
}

export const ApprovalIdentifiers = ({ identifiers }: ApprovalIdentifiersProps) =>
  identifiers.map((identifier) => (
    <Typography key={`${identifier.name}-${identifier.value}`}>
      {identifier.name}: {identifier.value}
    </Typography>
  ));
