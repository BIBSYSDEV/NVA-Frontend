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
  marginTop: '0.5rem',
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
  const [customer, isLoadingCustomer, , setCustomer] = useFetch<CustomerInstitution>({ url: user?.customerId ?? '' });
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
        setCustomer(updateCustomerResponse.data);
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
          <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>
            {t('publish_strategy.registrator_can_publish')}
          </Typography>
          <StyledAccessRightsContainer>
            <StyledAccessRight>
              <CheckCircleIcon color="primary" />
              <Typography>{t('publish_strategy.metadata')}</Typography>
            </StyledAccessRight>
            <StyledAccessRight>
              <CheckCircleIcon color="primary" />
              <Typography>{t('publish_strategy.files_and_licenses')}</Typography>
            </StyledAccessRight>
          </StyledAccessRightsContainer>
          <Typography sx={{ textAlign: 'center' }}>
            {t('publish_strategy.registrator_can_publish_description')}
          </Typography>
        </Box>
      </WorkflowButton>

      <WorkflowButton
        disabled={isLoading}
        isSelected={!isLoading && customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly'}
        onClick={() => setPublicationWorkflow('RegistratorPublishesMetadataOnly')}>
        <Box>
          <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>
            {t('publish_strategy.registrator_can_publish')}
          </Typography>
          <StyledAccessRightsContainer>
            <StyledAccessRight>
              <CheckCircleIcon color="primary" />
              <Typography>{t('publish_strategy.metadata')}</Typography>
            </StyledAccessRight>
            <Typography>{t('publish_strategy.files_and_licenses')}</Typography>
          </StyledAccessRightsContainer>
        </Box>
      </WorkflowButton>

      <WorkflowButton
        disabled={isLoading}
        isSelected={!isLoading && customer?.publicationWorkflow === 'RegistratorCannotPublish'}
        onClick={() => setPublicationWorkflow('RegistratorCannotPublish')}>
        <Box>
          <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>
            {t('publish_strategy.registrator_cannot_publish')}
          </Typography>
          <StyledAccessRightsContainer>
            <Typography>{t('publish_strategy.metadata')}</Typography>
            <Typography>{t('publish_strategy.files_and_licenses')}</Typography>
          </StyledAccessRightsContainer>
          <Typography sx={{ textAlign: 'center' }}>
            {t('publish_strategy.registrator_cannot_publish_description')}
          </Typography>
        </Box>
      </WorkflowButton>
    </Box>
  );
};
