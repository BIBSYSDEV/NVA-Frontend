import { Box } from '@mui/material';
import { useContext } from 'react';
import { useWatch } from 'react-hook-form';
import { getTitleString } from '../../utils/registration-helpers';
import { PageHeader } from '../PageHeader';
import { RegistrationIconHeader } from '../RegistrationIconHeader';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardHeader = () => {
  const { formMethods } = useContext(MergeResultsWizardContext);

  const [mainTitle, instanceType, publicationDate] = useWatch({
    control: formMethods.control,
    name: [
      'entityDescription.mainTitle',
      'entityDescription.reference.publicationInstance.type',
      'entityDescription.publicationDate',
    ],
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <RegistrationIconHeader publicationInstanceType={instanceType} publicationDate={publicationDate} showYearOnly />
      <PageHeader variant="h1">{getTitleString(mainTitle)}</PageHeader>
    </Box>
  );
};
