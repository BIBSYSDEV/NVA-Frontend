import { Skeleton, styled, TableCell } from '@mui/material';

export const CenteredTableCell = styled(TableCell)({
  textAlign: 'center',
});

export const TableNumberSkeleton = styled(Skeleton)({
  width: '2ch',
  margin: 'auto',
});
