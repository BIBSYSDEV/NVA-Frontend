import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box, ButtonBase, CircularProgress, styled, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { PageSpinner } from '../../components/PageSpinner';
import { setCustomer } from '../../redux/customerReducer';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { dataTestId } from '../../utils/dataTestIds';
import { StyledAccessRight, StyledAccessRightsContainer } from './PublishingStrategyOverview';
import { RightsRetentionStrategySettings } from './RightsRetentionStrategySettings';

const StyledItemContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: '7fr 1fr',
  gap: '1rem',
  maxWidth: '40rem',
  alignItems: 'center',
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
  const customer = useSelector((store: RootState) => store.customer);

  const updateRightsRetentionStrategy = useMutation({
    mutationFn: (customer: CustomerInstitution) => updateCustomerInstitution(customer),
    onSuccess: (response) => {
      dispatch(setCustomer(response.data));
      dispatch(setNotification({ message: t('feedback.success.update_publish_strategy'), variant: 'success' }));
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_publish_strategy'), variant: 'error' })),
  });

  const currentPublishStrategy = customer?.publicationWorkflow;

  return (
    <>
      <Helmet>
        <title id="publish-strategy-label">{t('editor.publish_strategy.publish_strategy')}</title>
      </Helmet>

      {!customer ? (
        <PageSpinner />
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <StyledItemContainer>
              <PublishStrategyButton
                focusRipple
                disabled={
                  updateRightsRetentionStrategy.isLoading ||
                  currentPublishStrategy === 'RegistratorPublishesMetadataAndFiles'
                }
                isSelected={
                  !updateRightsRetentionStrategy.isLoading &&
                  currentPublishStrategy === 'RegistratorPublishesMetadataAndFiles'
                }
                data-testid={dataTestId.editor.workflowRegistratorPublishesAll}
                onClick={() =>
                  updateRightsRetentionStrategy.mutate({
                    ...customer,
                    publicationWorkflow: 'RegistratorPublishesMetadataAndFiles',
                  })
                }>
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
              {updateRightsRetentionStrategy.isLoading &&
                customer.publicationWorkflow !== 'RegistratorPublishesMetadataAndFiles' && (
                  <CircularProgress aria-labelledby="publish-strategy-label" />
                )}
            </StyledItemContainer>

            <StyledItemContainer>
              <PublishStrategyButton
                focusRipple
                disabled={
                  updateRightsRetentionStrategy.isLoading ||
                  currentPublishStrategy === 'RegistratorPublishesMetadataOnly'
                }
                isSelected={
                  !updateRightsRetentionStrategy.isLoading &&
                  currentPublishStrategy === 'RegistratorPublishesMetadataOnly'
                }
                data-testid={dataTestId.editor.workflowRegistratorPublishesMetadata}
                onClick={() =>
                  updateRightsRetentionStrategy.mutate({
                    ...customer,
                    publicationWorkflow: 'RegistratorPublishesMetadataOnly',
                  })
                }>
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
              {updateRightsRetentionStrategy.isLoading &&
                customer.publicationWorkflow !== 'RegistratorPublishesMetadataOnly' && (
                  <CircularProgress aria-labelledby="publish-strategy-label" />
                )}
            </StyledItemContainer>
          </Box>
          <RightsRetentionStrategySettings />
        </>
      )}
    </>
  );
};
