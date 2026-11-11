import { Box } from '@mui/material';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { RelatedApprovalField } from '../../../kbs/approval/RelatedApprovalField';
import { RelatedProjectsField } from './RelatedProjectsField';
import { RelatedRegistrationsField } from './RelatedRegistrationsField';
import { FormBox } from './styles';

export const ProjectConnectionsForm = () => {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormBox>
          <RelatedProjectsField />
        </FormBox>
        <FormBox>
          <RelatedRegistrationsField />
        </FormBox>
        <FormBox>
          <RelatedApprovalField />
        </FormBox>
      </Box>
    </ErrorBoundary>
  );
};
