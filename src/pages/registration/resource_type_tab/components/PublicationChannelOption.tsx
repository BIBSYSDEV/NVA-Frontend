import { AutocompleteRenderOptionState, Box, Typography } from '@mui/material';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { NpiLevelTypography } from '../../../../components/NpiLevelTypography';
import { Journal, Publisher, Series } from '../../../../types/registration.types';
import { getPublicationChannelString } from '../../../../utils/registration-helpers';

interface PublicationChannelOptionProps {
  option: Journal | Series | Publisher;
  state: AutocompleteRenderOptionState;
}

export const PublicationChannelOption = ({ option, state }: PublicationChannelOptionProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <Typography>
      <EmphasizeSubstring text={getPublicationChannelString(option)} emphasized={state.inputValue} />
    </Typography>
    <NpiLevelTypography variant="body2" color="textSecondary" scientificValue={option.scientificValue} />
  </Box>
);
