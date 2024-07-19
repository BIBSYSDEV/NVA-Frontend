import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box, Divider, Link, styled, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PageSpinner } from '../../components/PageSpinner';
import { RootState } from '../../redux/store';
import { CustomerRrsType } from '../../types/customerInstitution.types';

const PublishStrategyContainer = styled('div')({
  padding: '0.5rem',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
  boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.30)',
});

export const StyledAccessRight = styled('div')({
  display: 'flex',
  gap: '0.5rem',
});

const coalitionSUrl = 'https://www.coalition-s.org/resources/rights-retention-strategy/';

export const StyledAccessRightsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-evenly',
  marginTop: '0.5rem',
  marginBottom: '0.5rem',
});

export const PublishingStrategyOverview = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);

  const currentPublishStrategy = customer?.publicationWorkflow;
  const isRrs = customer?.rightsRetentionStrategy?.type === CustomerRrsType.RightsRetentionStrategy;
  const isOverridableRrs =
    customer?.rightsRetentionStrategy?.type === CustomerRrsType.OverridableRightsRetentionStrategy;

  return (
    <>
      <Helmet>
        <title>{t('editor.publish_strategy.publish_strategy')}</title>
      </Helmet>

      {!customer ? (
        <PageSpinner />
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: { md: '75%', lg: '50%' } }}>
            <Typography variant="h2">{t('editor.publish_strategy.publish_strategy')}</Typography>
            <PublishStrategyContainer>
              {currentPublishStrategy === 'RegistratorPublishesMetadataAndFiles' ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </PublishStrategyContainer>

            <Divider />

            <Typography variant="h3">{t('editor.retention_strategy.rrs')}</Typography>
            {isRrs || isOverridableRrs ? (
              <>
                <Trans
                  i18nKey="editor.retention_strategy.customer_has_rrs_text"
                  components={[<Typography key="1" />]}
                />

                <Typography variant="h3">{t('editor.retention_strategy.rrs_info_page')}</Typography>

                <Link href={customer.rightsRetentionStrategy.id} target="_blank" rel="noopener noreferrer">
                  {customer.rightsRetentionStrategy.id}
                </Link>

                <Typography variant="h3">{t('editor.retention_strategy.possible_not_to_follow_rrs')}</Typography>
                {isOverridableRrs ? (
                  <Trans
                    i18nKey="editor.retention_strategy.creator_can_override_rrs_text"
                    components={[
                      <Typography key="1">
                        <Link href={coalitionSUrl} target="_blank" rel="noopener noreferrer" />
                      </Typography>,
                      <Typography key="2" />,
                    ]}
                  />
                ) : (
                  <Trans
                    i18nKey="editor.retention_strategy.curator_can_override_rrs_text"
                    components={[
                      <Typography key="1" />,
                      <Typography key="2">
                        <Link href={coalitionSUrl} target="_blank" rel="noopener noreferrer" />
                      </Typography>,
                    ]}
                  />
                )}
              </>
            ) : (
              <Trans
                i18nKey="editor.retention_strategy.customer_has_no_rrs"
                components={[
                  <Typography key="1" />,
                  <Typography key="2">
                    <Link href={coalitionSUrl} target="_blank" rel="noopener noreferrer" />
                  </Typography>,
                ]}
              />
            )}
          </Box>
        </>
      )}
    </>
  );
};
