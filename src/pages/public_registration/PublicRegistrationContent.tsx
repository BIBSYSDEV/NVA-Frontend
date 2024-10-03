import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { fetchResults, FetchResultsParams } from '../../api/searchApi';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { StyledPaperHeader } from '../../components/PageWithSideMenu';
import { StructuredSeoData } from '../../components/StructuredSeoData';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { TruncatableTypography } from '../../components/TruncatableTypography';
import { RegistrationFormLocationState } from '../../types/locationState.types';
import { DegreeType, ResearchDataType } from '../../types/publicationFieldNames';
import { ConfirmedDocument, Registration, RegistrationStatus, RelatedDocument } from '../../types/registration.types';
import { API_URL } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { getTitleString, isBook, isReport, isResearchData, userHasAccessRight } from '../../utils/registration-helpers';
import { getRegistrationWizardPath } from '../../utils/urlPaths';
import { DeletedPublicationInformation } from './DeletedPublicationInformation';
import { FilesLandingPageAccordion } from './public_files/FilesLandingPageAccordion';
import { ListExternalRelations } from './public_links/ListExternalRelations';
import { ListRegistrationRelations } from './public_links/ListRegistrationRelations';
import { ShowRelatedDocuments } from './public_links/ShowRelatedDocuments';
import { ShowRelatedRegistrationUris } from './public_links/ShowRelatedRegistrationUris';
import { PublicFundingsContent } from './PublicFundingsContent';
import { PublicGeneralContent } from './PublicGeneralContent';
import { PublicProjectsContent } from './PublicProjectsContent';
import { PublicRegistrationContributors } from './PublicRegistrationContributors';
import { PublicSubjectAndClassificationContent } from './PublicSubjectAndClassificationContent';
import { PublicSummaryContent } from './PublicSummaryContent';

export interface PublicRegistrationContentProps {
  registration: Registration;
}

export const PublicRegistrationContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();

  const { identifier, entityDescription, projects, subjects, fundings } = registration;
  const contributors = entityDescription?.contributors ?? [];
  const mainTitle = getTitleString(entityDescription?.mainTitle);
  const abstract = entityDescription?.abstract;
  const description = entityDescription?.description;

  const relatedRegistrationsQueryConfig: FetchResultsParams = {
    query: identifier,
    idNot: identifier,
    results: 20,
  };
  const relatedRegistrationsQuery = useQuery({
    queryKey: ['registrations', relatedRegistrationsQueryConfig],
    queryFn: ({ signal }) => fetchResults(relatedRegistrationsQueryConfig, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const userCanEditRegistration = userHasAccessRight(registration, 'update');

  return (
    <Paper elevation={0} sx={{ gridArea: 'registration' }}>
      {registration.status === RegistrationStatus.Published && <StructuredSeoData uri={registration.id} />}
      <Helmet>
        <title>{mainTitle}</title>
      </Helmet>
      <Box sx={visuallyHidden}>
        <DeletedPublicationInformation registration={registration} />
      </Box>
      <StyledPaperHeader>
        {entityDescription?.reference?.publicationInstance?.type ? (
          <Typography data-testid={dataTestId.registrationLandingPage.registrationSubtype} sx={{ color: 'inherit' }}>
            {t(`registration.publication_types.${entityDescription.reference.publicationInstance.type}`)}
          </Typography>
        ) : null}
        <TruncatableTypography variant="h1" sx={{ color: 'inherit' }}>
          {mainTitle}
        </TruncatableTypography>
        {userCanEditRegistration && (
          <Tooltip title={t('registration.edit_registration')}>
            <IconButton
              data-testid={dataTestId.registrationLandingPage.editButton}
              sx={{ ml: 'auto', color: 'inherit' }}
              component={RouterLink}
              state={{ previousPath: window.location.pathname } satisfies RegistrationFormLocationState}
              to={getRegistrationWizardPath(identifier)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </StyledPaperHeader>
      <BackgroundDiv>
        {contributors.length > 0 && entityDescription?.reference?.publicationInstance?.type && (
          <PublicRegistrationContributors
            contributors={contributors}
            registrationType={entityDescription.reference.publicationInstance.type}
          />
        )}
        <DeletedPublicationInformation aria-hidden={true} registration={registration} />

        <PublicGeneralContent registration={registration} />

        {(registration.status === RegistrationStatus.Draft || registration.status === RegistrationStatus.New) && (
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: '0.5rem' }}>
            <Typography
              sx={{
                py: '0.3rem',
                px: { xs: '2rem', sm: '3rem' },
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
              }}>
              {t('registration.public_page.result_not_published')}
            </Typography>
          </Box>
        )}

        {!isResearchData(entityDescription?.reference?.publicationInstance?.type) && (
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

        {entityDescription && (entityDescription.tags.length > 0 || subjects.length > 0) && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.subjectAndClassificationAccordion}
            defaultExpanded
            heading={t('registration.public_page.subject_and_classification')}>
            <PublicSubjectAndClassificationContent registration={registration} />
          </LandingPageAccordion>
        )}

        {entityDescription?.reference?.publicationInstance?.type === ResearchDataType.Dataset && (
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

        {entityDescription?.reference?.publicationInstance?.type === DegreeType.Phd &&
          entityDescription.reference.publicationInstance.related &&
          entityDescription.reference.publicationInstance.related.length > 0 && (
            <LandingPageAccordion
              dataTestId={dataTestId.registrationLandingPage.relatedPublicationsAccordion}
              defaultExpanded
              heading={t('common.consists_of')}>
              <ShowRelatedDocuments related={entityDescription.reference.publicationInstance.related} />
            </LandingPageAccordion>
          )}

        {entityDescription?.reference?.publicationInstance?.type === ResearchDataType.DataManagementPlan && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.relatedPublicationsAccordion}
            defaultExpanded
            heading={t('registration.resource_type.research_data.related_publications')}>
            <ShowRelatedRegistrationUris
              links={filterConfirmedDocuments(entityDescription.reference.publicationInstance.related).filter(
                (uri) => uri.includes(API_URL) // DMP can have both internal and external links in .related
              )}
              emptyMessage={t('registration.resource_type.research_data.no_related_publications')}
              loadingLabel={t('registration.resource_type.research_data.related_publications')}
            />
          </LandingPageAccordion>
        )}

        {isResearchData(entityDescription?.reference?.publicationInstance?.type) && (
          <FilesLandingPageAccordion registration={registration} />
        )}

        {projects.length > 0 && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.projectsAccordion}
            defaultExpanded
            heading={`${t('registration.description.project_association')} (${projects.length})`}>
            <PublicProjectsContent projects={projects} />
          </LandingPageAccordion>
        )}

        {fundings.length > 0 && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.fundingsAccordion}
            defaultExpanded
            heading={`${t('common.funding')} (${fundings.length})`}>
            <PublicFundingsContent fundings={fundings} />
          </LandingPageAccordion>
        )}

        {entityDescription?.reference?.publicationInstance?.type === ResearchDataType.Dataset && (
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
              heading={`${t('registration.resource_type.research_data.external_links')} (${
                entityDescription.reference.publicationInstance.related?.length ?? 0
              })`}>
              <ListExternalRelations
                links={filterConfirmedDocuments(entityDescription.reference.publicationInstance.related)}
              />
            </LandingPageAccordion>
          </>
        )}
        {entityDescription?.reference?.publicationInstance?.type === ResearchDataType.DataManagementPlan && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.externalLinksAccordion}
            defaultExpanded
            heading={`${t('registration.resource_type.research_data.external_links')} (${
              filterExternalRelatedLinks(
                filterConfirmedDocuments(entityDescription.reference.publicationInstance.related)
              ).length ?? 0 // DMP can have both internal and external links in .related
            })`}>
            <ListExternalRelations
              links={filterExternalRelatedLinks(
                filterConfirmedDocuments(entityDescription.reference.publicationInstance.related)
              )}
            />
          </LandingPageAccordion>
        )}

        {relatedRegistrationsQuery.data && relatedRegistrationsQuery.data.totalHits > 0 && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.relatedRegistrationsAccordion}
            defaultExpanded
            heading={`${
              isBook(entityDescription?.reference?.publicationInstance?.type) ||
              isReport(entityDescription?.reference?.publicationInstance?.type)
                ? t('common.chapters')
                : t('registration.public_page.other_related_registrations')
            } (${relatedRegistrationsQuery.data.totalHits})`}>
            <ListRegistrationRelations registrations={relatedRegistrationsQuery.data.hits} />
          </LandingPageAccordion>
        )}
      </BackgroundDiv>
    </Paper>
  );
};

export const filterConfirmedDocuments = (relatedDocuments: RelatedDocument[] = []) =>
  relatedDocuments
    .filter((relatedDocument) => relatedDocument.type === 'ConfirmedDocument')
    .map((confirmedDocument) => (confirmedDocument as ConfirmedDocument).identifier);

const filterExternalRelatedLinks = (links: string[] = []) => links.filter((link) => !link.includes(API_URL));
