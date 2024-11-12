import { Box, Typography } from '@mui/material';
import { HTMLAttributes } from 'react';
import { CristinProject } from '../types/project.types';
import { dataTestId } from '../utils/dataTestIds';
import { getLanguageString } from '../utils/translation-helpers';
import { EmphasizeSubstring } from './EmphasizeSubstring';

interface AutocompleteProjectOptionProps extends HTMLAttributes<HTMLLIElement> {
  project: CristinProject;
  inputValue: string;
}

export const AutocompleteProjectOption = ({ project, inputValue, ...props }: AutocompleteProjectOptionProps) => (
  <li {...props} key={project.id}>
    <Box
      sx={{ display: 'flex', flexDirection: 'column' }}
      data-testid={dataTestId.registrationWizard.description.projectSearchOption(project.id)}>
      <Typography variant="subtitle1">
        <EmphasizeSubstring text={project.title} emphasized={inputValue} />
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {getLanguageString(project.coordinatingInstitution.labels)}
      </Typography>
    </Box>
  </li>
);
