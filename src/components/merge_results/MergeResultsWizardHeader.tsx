import { Box } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { Registration } from '../../types/registration.types';
import { getTitleString } from '../../utils/registration-helpers';
import { PageHeader } from '../PageHeader';
import { RegistrationIconHeader } from '../RegistrationIconHeader';

export const MergeResultsWizardHeader = () => {
  const { control } = useFormContext<Registration>();

  const [mainTitle, instanceType, publicationDate] = useWatch({
    control,
    name: [
      'entityDescription.mainTitle',
      'entityDescription.reference.publicationInstance.type',
      'entityDescription.publicationDate',
    ],
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <RegistrationIconHeader publicationInstanceType={instanceType} publicationDate={publicationDate} showYearOnly />
      <PageHeader variant="h2" omitPageTitle>
        {getTitleString(mainTitle)}
      </PageHeader>
    </Box>
  );
};
