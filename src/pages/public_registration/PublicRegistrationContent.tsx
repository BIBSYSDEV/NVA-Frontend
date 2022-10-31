import { useTranslation } from 'react-i18next';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { PublicGeneralContent } from './PublicGeneralContent';
import { PublicProjectsContent } from './PublicProjectsContent';
import { PublicRegistrationContributors } from './PublicRegistrationContributors';
import { PublicSummaryContent } from './PublicSummaryContent';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { ShareOptions } from './ShareOptions';
import { SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { RegistrationFieldName, ResearchDataType } from '../../types/publicationFieldNames';
import { SearchResponse } from '../../types/common.types';
import { FilesLandingPageAccordion } from './public_files/FilesLandingPageAccordion';
import { getTitleString, isResearchData, userCanEditRegistration } from '../../utils/registration-helpers';
import { API_URL } from '../../utils/constants';
import { ListExternalRelations } from './public_links/ListExternalRelations';
import { ListRegistrationRelations } from './public_links/ListRegistrationRelations';
import { ShowRelatedRegistrationUris } from './public_links/ShowRelatedRegistrationUris';
import { StyledPaperHeader } from '../../components/PageWithSideMenu';
import { TruncatableTypography } from '../../components/TruncatableTypography';
import { RootState } from '../../redux/store';
import { getRegistrationPath } from '../../utils/urlPaths';

export interface PublicRegistrationContentProps {
  registration: Registration;
}

export const PublicRegistrationContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const { identifier, entityDescription, projects, subjects } = registration;
  const contributors = entityDescription?.contributors ?? [];
  const mainTitle = getTitleString(entityDescription?.mainTitle);
  const abstract = entityDescription?.abstract;
  const description = entityDescription?.description;

  const [relatedRegistrations] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?query="${identifier}" AND NOT (${RegistrationFieldName.Identifier}:"${identifier}")`,
    errorMessage: t('feedback.error.search'),
  });

  return (
    <Paper sx={{ gridArea: 'center' }}>
      <StyledPaperHeader sx={{ gap: '1.5rem', p: '0.5rem' }}>
        {entityDescription?.reference?.publicationInstance.type ? (
          <Typography data-testid={dataTestId.registrationLandingPage.registrationSubtype} sx={{ color: 'inherit' }}>
            {t(`registration.publication_types.${entityDescription.reference.publicationInstance.type}`)}
          </Typography>
        ) : null}
        <TruncatableTypography variant="h2" variantMapping={{ h2: 'h1' }} sx={{ color: 'inherit' }}>
          {mainTitle}
        </TruncatableTypography>
        {userCanEditRegistration(user, registration) && (
          <Tooltip title={t('registration.edit_registration')}>
            <IconButton
              data-testid={dataTestId.registrationLandingPage.editButton}
              sx={{ ml: 'auto', color: 'inherit' }}
              component={RouterLink}
              to={getRegistrationPath(identifier)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </StyledPaperHeader>

      <Box sx={{ m: '2rem' }}>
        {contributors.length > 0 && entityDescription?.reference?.publicationInstance.type && (
          <PublicRegistrationContributors
            contributors={contributors}
            registrationType={entityDescription.reference.publicationInstance.type}
          />
        )}

        <PublicGeneralContent registration={registration} />

        {!isResearchData(entityDescription?.reference?.publicationInstance.type) && (
          <FilesLandingPageAccordion registration={registration} />
        )}

        {entityDescription && (abstract || description || entityDescription.tags.length > 0 || subjects.length > 0) && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.abstractAccordion}
            defaultExpanded
            heading={t('registration.description.abstract')}>
            <PublicSummaryContent registration={registration} />
          </LandingPageAccordion>
        )}

        {entityDescription?.reference?.publicationInstance.type === ResearchDataType.Dataset && (
          <>
            <LandingPageAccordion
              dataTestId={dataTestId.registrationLandingPage.geographicAccordion}
              defaultExpanded
              heading={t('registration.resource_type.research_data.geographic_description')}>
              <Typography>
                {entityDescription.reference.publicationInstance.geographicalCoverage?.description}
              </Typography>
            </LandingPageAccordion>

            <LandingPageAccordion
              dataTestId={dataTestId.registrationLandingPage.publicationsUsingDatasetAccordion}
              defaultExpanded
              heading={t('registration.resource_type.research_data.publications_using_dataset')}>
              <ShowRelatedRegistrationUris
                links={entityDescription.reference.publicationInstance.referencedBy}
                emptyMessage={t('registration.resource_type.research_data.no_publications_using_dataset')}
                loadingLabel={t('registration.resource_type.research_data.publications_using_dataset')}
              />
            </LandingPageAccordion>
          </>
        )}

        {entityDescription?.reference?.publicationInstance.type === ResearchDataType.DataManagementPlan && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.relatedPublicationsAccordion}
            defaultExpanded
            heading={t('registration.resource_type.research_data.related_publications')}>
            <ShowRelatedRegistrationUris
              links={entityDescription.reference.publicationInstance.related?.filter(
                (uri) => uri.includes(API_URL) // DMP can have both internal and external links in .related
              )}
              emptyMessage={t('registration.resource_type.research_data.no_related_publications')}
              loadingLabel={t('registration.resource_type.research_data.related_publications')}
            />
          </LandingPageAccordion>
        )}

        {isResearchData(entityDescription?.reference?.publicationInstance.type) && (
          <FilesLandingPageAccordion registration={registration} />
        )}

        {projects.length > 0 && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.projectsAccordion}
            defaultExpanded
            heading={t('registration.description.project_association')}>
            <PublicProjectsContent projects={projects} />
          </LandingPageAccordion>
        )}

        {entityDescription?.reference?.publicationInstance.type === ResearchDataType.Dataset && (
          <>
            <LandingPageAccordion
              dataTestId={dataTestId.registrationLandingPage.dmpAccordion}
              defaultExpanded
              heading={t('registration.publication_types.DataManagementPlan')}>
              <ShowRelatedRegistrationUris
                links={entityDescription.reference.publicationInstance.compliesWith}
                emptyMessage={t('registration.resource_type.research_data.no_dmp')}
                loadingLabel={t('registration.publication_types.DataManagementPlan')}
              />
            </LandingPageAccordion>

            <LandingPageAccordion
              dataTestId={dataTestId.registrationLandingPage.externalLinksAccordion}
              defaultExpanded
              heading={t('registration.resource_type.research_data.external_links')}>
              <ListExternalRelations links={entityDescription.reference.publicationInstance.related} />
            </LandingPageAccordion>
          </>
        )}
        {entityDescription?.reference?.publicationInstance.type === ResearchDataType.DataManagementPlan && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.externalLinksAccordion}
            defaultExpanded
            heading={t('registration.resource_type.research_data.external_links')}>
            <ListExternalRelations
              links={entityDescription.reference.publicationInstance.related?.filter(
                (uri) => !uri.includes(API_URL) // DMP can have both internal and external links in .related
              )}
            />
          </LandingPageAccordion>
        )}

        {relatedRegistrations && relatedRegistrations.hits.length > 0 && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.relatedRegistrationsAccordion}
            defaultExpanded
            heading={t('registration.public_page.other_related_registrations')}>
            <ListRegistrationRelations registrations={relatedRegistrations.hits} />
          </LandingPageAccordion>
        )}

        <ShareOptions title={mainTitle} description={abstract ?? description ?? ''} />
      </Box>
    </Paper>
  );
};
