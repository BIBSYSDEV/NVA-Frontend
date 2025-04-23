import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { PublicationChannelTableRow } from './PublicationChannelTableRow';
import { ClaimedChannel } from '../../types/customerInstitution.types';
import { PublicationChannelType } from '../../types/registration.types';

type SelectedPublicationChannelType =
  | PublicationChannelType.Journal
  | PublicationChannelType.Publisher
  | PublicationChannelType.Series;

interface ChannelClaimTableProps {
  channelClaimList: ClaimedChannel[];
  channelType: SelectedPublicationChannelType;
}

export const ChannelClaimTable = ({ channelClaimList, channelType }: ChannelClaimTableProps) => {
  const channelClaims = filterClaimedChannels({ channelClaimList, channelType }) ?? [];

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

const filterClaimedChannels = ({ channelClaimList, channelType }: ChannelClaimTableProps) => {
  if (channelType === PublicationChannelType.Publisher) {
    return channelClaimList.filter((channel) => channel.channelClaim.channel.includes('/publisher'));
  }
};
