import { Box, ButtonBase, styled, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../redux/store';
import { CustomerInstitution, PublicationWorkflowType } from '../../types/customerInstitution.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { setNotification } from '../../redux/notificationSlice';

const StyledAccessRight = styled('div')({
  display: 'flex',
  gap: '0.5rem',
});

const StyledAccessRightsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-evenly',
  marginBottom: '0.5rem',
});

interface PublishStrategySettingsProps {
  isSelected: boolean;
}

const WorkflowButton = styled(ButtonBase, { shouldForwardProp: (prop) => prop !== 'isSelected' })(
  ({ isSelected }: PublishStrategySettingsProps) => ({
    padding: '0.5rem',
    border: isSelected ? '2px solid' : '1px solid',
    borderRadius: '0.5rem',
    opacity: isSelected ? 1 : 0.5,
  })
);

export const PublishStrategySettings = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('editor');
  const user = useSelector((store: RootState) => store.user);
  const [customer, isLoadingCustomer] = useFetch<CustomerInstitution>({ url: user?.customerId ?? '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const setPublicationWorkflow = async (workflow: PublicationWorkflowType) => {
    if (customer) {
      setIsUpdating(true);
      const updateCustomerResponse = await updateCustomerInstitution({
        ...customer,
        publicationWorkflow: workflow,
      });
      if (isErrorStatus(updateCustomerResponse.status)) {
        dispatch(setNotification({ message: t('feedback:error.update_publish_strategy'), variant: 'error' }));
      } else if (isSuccessStatus(updateCustomerResponse.status)) {
        dispatch(setNotification({ message: t('feedback:success.update_publish_strategy'), variant: 'success' }));
      }
      setIsUpdating(false);
    }
  };

  const isLoading = isLoadingCustomer || isUpdating;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '35rem' }}>
      <WorkflowButton
        disabled={isLoading}
        isSelected={!isLoading && customer?.publicationWorkflow === 'RegistratorPublishesMetadataAndFiles'}
        onClick={() => setPublicationWorkflow('RegistratorPublishesMetadataAndFiles')}>
        <Box>
          <Typography sx={{ fontWeight: 700, mb: '0.5rem', textAlign: 'center' }}>
            Registrator publiserer uten godkjenning fra Kurator
          </Typography>
          <StyledAccessRightsContainer>
            <StyledAccessRight>
              <CheckCircleIcon color="primary" />
              <Typography>Metadata</Typography>
            </StyledAccessRight>
            <StyledAccessRight>
              <CheckCircleIcon color="primary" />
              <Typography>Filer og lisenser</Typography>
            </StyledAccessRight>
          </StyledAccessRightsContainer>
          <Typography sx={{ textAlign: 'center' }}>Institutsjonen bestemmer hvem som er Registrator.</Typography>
        </Box>
      </WorkflowButton>

      <WorkflowButton
        disabled={isLoading}
        isSelected={!isLoading && customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly'}
        onClick={() => setPublicationWorkflow('RegistratorPublishesMetadataOnly')}>
        <Box>
          <Typography sx={{ fontWeight: 700, mb: '0.5rem', textAlign: 'center' }}>
            Registrator publiserer uten godkjenning fra Kurator
          </Typography>
          <StyledAccessRightsContainer>
            <StyledAccessRight>
              <CheckCircleIcon color="primary" />
              <Typography>Metadata</Typography>
            </StyledAccessRight>
            <Typography>Filer og lisenser</Typography>
          </StyledAccessRightsContainer>
        </Box>
      </WorkflowButton>

      <WorkflowButton
        disabled={isLoading}
        isSelected={!isLoading && customer?.publicationWorkflow === 'RegistratorCannotPublish'}
        onClick={() => setPublicationWorkflow('RegistratorCannotPublish')}>
        <Box>
          <Typography sx={{ fontWeight: 700, mb: '0.5rem', textAlign: 'center' }}>
            Registrator kan kun registrere
          </Typography>
          <StyledAccessRightsContainer>
            <Typography>Metadata</Typography>
            <Typography>Filer og lisenser</Typography>
          </StyledAccessRightsContainer>
          <Typography sx={{ textAlign: 'center' }}>
            Metadata, filer og lisenser må godkjennes av Kurator før publisering.
          </Typography>
        </Box>
      </WorkflowButton>
    </Box>
  );
};
