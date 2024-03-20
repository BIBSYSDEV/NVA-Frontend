import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box, Divider, Link, styled, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PageSpinner } from '../../components/PageSpinner';
import { RootState } from '../../redux/store';
import { CustomerRrsType } from '../../types/customerInstitution.types';
import { StyledAccessRight, StyledAccessRightsContainer } from './PublishStrategySettings';

const PublishStrategyContainer = styled('div')({
  padding: '0.5rem',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
  boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.30)',
});

export const PublishingStrategyOverview = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);

  const currentPublishStrategy = customer?.publicationWorkflow;
  const isRrs = customer?.rightsRetentionStrategy?.type === CustomerRrsType.RightsRetentionStrategy;
  const isOverridableRrs =
    customer?.rightsRetentionStrategy?.type === CustomerRrsType.OverridableRightsRetentionStrategy;
  const isNullRrs = customer?.rightsRetentionStrategy?.type === CustomerRrsType.NullRightsRetentionStrategy;

  return (
    <>
      <Helmet>
        <title id="publish-strategy-label">{t('editor.publish_strategy.publish_strategy')}</title>
      </Helmet>

      {!customer ? (
        <PageSpinner />
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: { md: '75%', lg: '50%' } }}>
            <Typography variant="h2">{t('editor.publish_strategy.publish_strategy')}</Typography>
            <PublishStrategyContainer>
              {currentPublishStrategy === 'RegistratorPublishesMetadataAndFiles' ? (
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
              ) : (
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
              )}
            </PublishStrategyContainer>

            <Divider />

            <Typography variant="h3">{t('editor.retention_strategy.rrs')}</Typography>
            <Box sx={{ bgcolor: 'white', border: '1px solid', borderRadius: '4px', p: '0.5rem' }}>
              <Typography>Institusjonen følger Rights RetentionStrategy (RRS)</Typography>
            </Box>
            <Typography variant="h3">{t('editor.retention_strategy.rrs_info_page')}</Typography>
            <Box sx={{ bgcolor: 'white', border: '1px solid', borderRadius: '4px', p: '0.5rem' }}>
              <Link href={customer.rightsRetentionStrategy.id} target="_blank" rel="noopener noreferrer">
                {customer.rightsRetentionStrategy.id}
              </Link>
            </Box>
            <Box sx={{ bgcolor: 'white', border: '1px solid', borderRadius: '4px', p: '0.5rem' }}>
              <Typography>{t('editor.retention_strategy.rrs_override')}</Typography>
            </Box>
            <Typography fontStyle="italic">
              Rights Retention Strategy vil sørge for at fulltekstersjoner av alle vitenskapelige artikler gjøres åpent
              tilgjengelig i,iddelbart uten embargo og uavhengig av publikasjonssted og finansiør. Dette vil bidra til
              at institusjonen så raskt som mulig når målet om at alle publikasjoner skal være åpent tilgjengelig.
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};
