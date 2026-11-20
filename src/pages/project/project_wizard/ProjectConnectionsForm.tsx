import { Box } from '@mui/material';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { RelatedApprovalField } from './related-approval-field/RelatedApprovalField';
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
        <BetaFunctionality>
          <FormBox>
            <RelatedApprovalField />
          </FormBox>
        </BetaFunctionality>
      </Box>
    </ErrorBoundary>
  );
};
