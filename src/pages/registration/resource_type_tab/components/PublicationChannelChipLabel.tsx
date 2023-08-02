import { Typography } from '@mui/material';
import { NpiLevelTypography } from '../../../../components/NpiLevelTypography';
import { Journal, Publisher, Series } from '../../../../types/registration.types';
import { getPublicationChannelString } from '../../../../utils/registration-helpers';

interface PublicationChannelChipProps {
  value: Journal | Series | Publisher;
}

export const PublicationChannelChipLabel = ({ value }: PublicationChannelChipProps) => (
  <>
    <Typography variant="subtitle1">{getPublicationChannelString(value)}</Typography>
    <NpiLevelTypography variant="body2" color="textSecondary" scientificValue={value.scientificValue} />
  </>
);
