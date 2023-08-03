import { AutocompleteRenderOptionState, Box, Typography } from '@mui/material';
import { HTMLAttributes } from 'react';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { NpiLevelTypography } from '../../../../components/NpiLevelTypography';
import { Journal, Publisher, Series } from '../../../../types/registration.types';
import { getPublicationChannelString } from '../../../../utils/registration-helpers';

interface PublicationChannelOptionProps {
  props: HTMLAttributes<HTMLLIElement>;
  option: Journal | Series | Publisher;
  state: AutocompleteRenderOptionState;
}

export const PublicationChannelOption = ({ props, option, state }: PublicationChannelOptionProps) => (
  <li {...props}>
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography>
        <EmphasizeSubstring text={getPublicationChannelString(option)} emphasized={state.inputValue} />
      </Typography>
      <NpiLevelTypography variant="body2" color="textSecondary" scientificValue={option.scientificValue} />
    </Box>
  </li>
);
