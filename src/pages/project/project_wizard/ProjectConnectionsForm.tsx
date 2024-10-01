import { Box } from '@mui/material';
import { useFormikContext } from 'formik';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { CristinProject } from '../../../types/project.types';
import { RelatedProjectsField } from './RelatedProjectsField';
import { RelatedRegistrationsField } from './RelatedRegistrationsField';
import { FormBox } from './styles';

export const ProjectConnectionsForm = () => {
  const { values } = useFormikContext<CristinProject>();

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormBox>
          <RelatedProjectsField />
        </FormBox>
        {values.id && (
          <FormBox>
            <RelatedRegistrationsField />
          </FormBox>
        )}
      </Box>
    </ErrorBoundary>
  );
};
