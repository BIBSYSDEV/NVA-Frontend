import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { PublicationChannelTableRow } from './PublicationChannelTableRow';
import { ClaimedChannel } from '../../types/customerInstitution.types';

interface ChannelClaimTableProps {
  channelClaims: ClaimedChannel[];
}

export const ChannelClaimTable = ({ channelClaims }: ChannelClaimTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Utgiver</TableCell>
            <TableCell>Kanaleier</TableCell>
            <TableCell>Tilgang til å registrere</TableCell>
            <TableCell>Tilgang til å redigere</TableCell>
            <TableCell>Begrensning for kategori</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {channelClaims.map((claim, index) => {
            return <PublicationChannelTableRow claim={claim} key={index} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
