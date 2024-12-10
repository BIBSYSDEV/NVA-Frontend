import { AutocompleteRenderOptionState, Box, Typography } from '@mui/material';
import { HTMLAttributes } from 'react';
import { EmphasizeSubstring } from '../../../../components/EmphasizeSubstring';
import { NpiLevelTypography } from '../../../../components/NpiLevelTypography';
import { Publisher, SerialPublication } from '../../../../types/registration.types';
import { getPublicationChannelString } from '../../../../utils/registration-helpers';

interface PublicationChannelOptionProps {
  props: HTMLAttributes<HTMLLIElement>;
  option: SerialPublication | Publisher;
  state: AutocompleteRenderOptionState;
  hideScientificLevel?: boolean;
}

export const PublicationChannelOption = ({
  props,
  option,
  state,
  hideScientificLevel = false,
}: PublicationChannelOptionProps) => (
  <li {...props}>
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography>
        <EmphasizeSubstring text={getPublicationChannelString(option)} emphasized={state.inputValue} />
      </Typography>
      {!hideScientificLevel && (
        <NpiLevelTypography variant="body2" color="textSecondary" scientificValue={option.scientificValue} />
      )}
    </Box>
  </li>
);
