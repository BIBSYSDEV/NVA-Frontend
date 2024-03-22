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

            <Typography>Institusjonen har oppgitt en Rights Retention Strategy (RRS) i NVA.</Typography>
            <Typography>
              Lisens CC-BY blir automatisk satt på akseptert versjon av filer i registreringen av en vitenskapelig
              artikkel i NVA.
            </Typography>

            <Typography variant="h3">{t('editor.retention_strategy.rrs_info_page')}</Typography>

            <Link href={customer.rightsRetentionStrategy.id} target="_blank" rel="noopener noreferrer">
              {customer.rightsRetentionStrategy.id}
            </Link>

            <Typography variant="h3">Mulig å ikke følge institusjonens rettighetspolitikk</Typography>

            <Typography>
              Publiseringskurator har tilgang til å sette at filer ikke følger institusjonens rettigethspolitikk (RRS).
            </Typography>

            <Typography>
              Om registrator ikke øsnker følge institusjonens rettighetspolitikk (RRS) så se på vilkår om for ikke følge{' '}
              RRS på informasjonsside om institusjonens rettighetspolitikk
            </Typography>

            <Typography>
              Med å følge rettighetspolitikk (RRS) så blir vitenskapelige artikler åpent tilgjengelig umiddelbart uten
              embargo.{' '}
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};
