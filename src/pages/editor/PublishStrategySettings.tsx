import { Box, ButtonBase, CircularProgress, styled, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { RootState } from '../../redux/store';
import { PublishStrategy } from '../../types/customerInstitution.types';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { setNotification } from '../../redux/notificationSlice';
import { setCustomer } from '../../redux/customerReducer';
import { dataTestId } from '../../utils/dataTestIds';

const StyledItemContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: '7fr 1fr',
  gap: '1rem',
  maxWidth: '40rem',
  alignItems: 'center',
});

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

interface PublishStrategyButtonProps {
  isSelected: boolean;
}

const PublishStrategyButton = styled(ButtonBase, { shouldForwardProp: (prop) => prop !== 'isSelected' })(
  ({ isSelected }: PublishStrategyButtonProps) => ({
    padding: '0.5rem',
    border: isSelected ? '2px solid' : '1px solid',
    borderRadius: '0.5rem',
    opacity: isSelected ? 1 : 0.5,
  })
);

export const PublishStrategySettings = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { customer } = useSelector((store: RootState) => store);
  const [isUpdating, setIsUpdating] = useState<PublishStrategy>();

  const setPublicationWorkflow = async (publishStrategy: PublishStrategy) => {
    if (customer) {
      setIsUpdating(publishStrategy);
      const updateCustomerResponse = await updateCustomerInstitution({
        ...customer,
        publicationWorkflow: publishStrategy,
      });
      if (isErrorStatus(updateCustomerResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_publish_strategy'), variant: 'error' }));
      } else if (isSuccessStatus(updateCustomerResponse.status)) {
        dispatch(setCustomer(updateCustomerResponse.data));
        dispatch(setNotification({ message: t('feedback.success.update_publish_strategy'), variant: 'success' }));
      }
      setIsUpdating(undefined);
    }
  };

  const currentPublishStrategy = customer?.publicationWorkflow;

  return (
    <>
      <Helmet>
        <title id="publish-strategy-label">{t('editor.publish_strategy.publish_strategy')}</title>
      </Helmet>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <StyledItemContainer>
          <PublishStrategyButton
            focusRipple
            disabled={!!isUpdating || currentPublishStrategy === 'RegistratorPublishesMetadataAndFiles'}
            isSelected={!isUpdating && currentPublishStrategy === 'RegistratorPublishesMetadataAndFiles'}
            data-testid={dataTestId.editor.workflowRegistratorPublishesAll}
            onClick={() => setPublicationWorkflow('RegistratorPublishesMetadataAndFiles')}>
            <Box>
              <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>
                {t('editor.publish_strategy.registrator_publishes_without_curator')}
              </Typography>
              <StyledAccessRightsContainer>
                <StyledAccessRight>
                  <CheckCircleIcon color="primary" />
                  <Typography>{t('editor.publish_strategy.metadata')}</Typography>
                </StyledAccessRight>
                <StyledAccessRight>
                  <CheckCircleIcon color="primary" />
                  <Typography>{t('editor.publish_strategy.files_and_licenses')}</Typography>
                </StyledAccessRight>
              </StyledAccessRightsContainer>
              <Typography sx={{ textAlign: 'center' }}>
                {t('editor.publish_strategy.registrator_publishes_without_curator_description')}
              </Typography>
            </Box>
          </PublishStrategyButton>
          {isUpdating === 'RegistratorPublishesMetadataAndFiles' && (
            <CircularProgress aria-labelledby="publish-strategy-label" />
          )}
        </StyledItemContainer>

        <StyledItemContainer>
          <PublishStrategyButton
            focusRipple
            disabled={!!isUpdating || currentPublishStrategy === 'RegistratorPublishesMetadataOnly'}
            isSelected={!isUpdating && currentPublishStrategy === 'RegistratorPublishesMetadataOnly'}
            data-testid={dataTestId.editor.workflowRegistratorPublishesMetadata}
            onClick={() => setPublicationWorkflow('RegistratorPublishesMetadataOnly')}>
            <Box>
              <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>
                {t('editor.publish_strategy.registrator_publishes_metadata')}
              </Typography>
              <StyledAccessRightsContainer>
                <StyledAccessRight>
                  <CheckCircleIcon color="primary" />
                  <Typography>{t('editor.publish_strategy.metadata')}</Typography>
                </StyledAccessRight>
                <StyledAccessRight>
                  <RemoveCircleIcon color="error" />
                  <Typography>{t('editor.publish_strategy.files_and_licenses')}</Typography>
                </StyledAccessRight>
              </StyledAccessRightsContainer>
              <Typography sx={{ textAlign: 'center' }}>
                {t('editor.publish_strategy.registrator_publishes_metadata_description')}
              </Typography>
            </Box>
          </PublishStrategyButton>
          {isUpdating === 'RegistratorPublishesMetadataOnly' && (
            <CircularProgress aria-labelledby="publish-strategy-label" />
          )}
        </StyledItemContainer>

        <StyledItemContainer>
          <PublishStrategyButton
            focusRipple
            disabled={!!isUpdating || currentPublishStrategy === 'RegistratorRequiresApprovalForMetadataAndFiles'}
            isSelected={!isUpdating && currentPublishStrategy === 'RegistratorRequiresApprovalForMetadataAndFiles'}
            data-testid={dataTestId.editor.workflowRegistratorRequiresApproval}
            onClick={() => setPublicationWorkflow('RegistratorRequiresApprovalForMetadataAndFiles')}>
            <Box>
              <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>
                {t('editor.publish_strategy.registrator_cannot_publish')}
              </Typography>
              <StyledAccessRightsContainer>
                <StyledAccessRight>
                  <RemoveCircleIcon color="error" />
                  <Typography>{t('editor.publish_strategy.metadata')}</Typography>
                </StyledAccessRight>
                <StyledAccessRight>
                  <RemoveCircleIcon color="error" />
                  <Typography>{t('editor.publish_strategy.files_and_licenses')}</Typography>
                </StyledAccessRight>
              </StyledAccessRightsContainer>
              <Typography sx={{ textAlign: 'center' }}>
                {t('editor.publish_strategy.registrator_cannot_publish_description')}
              </Typography>
            </Box>
          </PublishStrategyButton>
          {isUpdating === 'RegistratorRequiresApprovalForMetadataAndFiles' && (
            <CircularProgress aria-labelledby="publish-strategy-label" />
          )}
        </StyledItemContainer>
      </Box>
    </>
  );
};
