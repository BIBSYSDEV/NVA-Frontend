import { Typography } from '@mui/material';
import { NpiLevelTypography } from '../../../../components/NpiLevelTypography';
import { Publisher, SerialPublication } from '../../../../types/registration.types';
import { getPublicationChannelString } from '../../../../utils/registration-helpers';

interface PublicationChannelChipProps {
  value: SerialPublication | Publisher;
}

export const PublicationChannelChipLabel = ({ value }: PublicationChannelChipProps) => (
  <>
    <Typography sx={{ fontWeight: 700 }}>{getPublicationChannelString(value)}</Typography>
    <NpiLevelTypography variant="body2" color="textSecondary" scientificValue={value.scientificValue} />
  </>
);
