import { Box } from '@mui/material';
import { useContext } from 'react';
import { getTitleString } from '../../utils/registration-helpers';
import { PageHeader } from '../PageHeader';
import { RegistrationIconHeader } from '../RegistrationIconHeader';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardHeader = () => {
  const { targetResult } = useContext(MergeResultsWizardContext);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <RegistrationIconHeader
        publicationInstanceType={targetResult.entityDescription?.reference?.publicationInstance?.type}
        publicationDate={targetResult.entityDescription?.publicationDate}
        showYearOnly
      />
      <PageHeader variant="h1">{getTitleString(targetResult.entityDescription?.mainTitle)}</PageHeader>
    </Box>
  );
};
