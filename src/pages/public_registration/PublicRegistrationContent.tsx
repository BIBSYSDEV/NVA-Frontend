import { useTranslation } from 'react-i18next';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Typography } from '@mui/material';
import { ItalicPageHeader } from '../../components/PageHeader';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { PublicGeneralContent } from './PublicGeneralContent';
import { PublicProjectsContent } from './PublicProjectsContent';
import { PublicRegistrationContributors } from './PublicRegistrationContributors';
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';
import { PublicSummaryContent } from './PublicSummaryContent';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { ShareOptions } from './ShareOptions';
import { SearchApiPath } from '../../api/apiPaths';
import { useFetch } from '../../utils/hooks/useFetch';
import { RegistrationList } from '../../components/RegistrationList';
import { RegistrationFieldName, ResearchDataType } from '../../types/publicationFieldNames';
import { SearchResponse } from '../../types/common.types';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { FilesLandingPageAccordion } from './public_files/FilesLandingPageAccordion';
import { getTitleString, isResearchData } from '../../utils/registration-helpers';
import { PublicExternalRelations, PublicRelatedPublications } from './PublicRelatedResourcesContent';
import { API_URL } from '../../utils/constants';

export interface PublicRegistrationContentProps {
  registration: Registration;
}
export interface PublicRegistrationProps extends PublicRegistrationContentProps {
  refetchRegistration: () => void;
}

export const PublicRegistrationContent = ({ registration, refetchRegistration }: PublicRegistrationProps) => {
  const { t } = useTranslation();

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
    <BackgroundDiv>
      <PublicRegistrationStatusBar registration={registration} refetchRegistration={refetchRegistration} />
      <ItalicPageHeader
        superHeader={{
          title: entityDescription?.reference?.publicationInstance.type ? (
            <>
              <span data-testid={dataTestId.registrationLandingPage.registrationSubtype}>
                {t(`registration.publication_types.${entityDescription.reference.publicationInstance.type}`)}
              </span>
              {entityDescription?.date?.year && (
                <Box
                  data-testid={dataTestId.registrationLandingPage.publicationDate}
                  component="span"
                  sx={{ pl: '1rem' }}>
                  {entityDescription.date.year}
                </Box>
              )}
            </>
          ) : null,
          icon: <MenuBookIcon />,
        }}
        data-testid={dataTestId.registrationLandingPage.title}>
        {mainTitle}
      </ItalicPageHeader>
      <div>
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
              <PublicRelatedPublications
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
            <PublicRelatedPublications
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
              <PublicRelatedPublications
                links={entityDescription.reference.publicationInstance.compliesWith}
                emptyMessage={t('registration.resource_type.research_data.no_dmp')}
                loadingLabel={t('registration.publication_types.DataManagementPlan')}
              />
            </LandingPageAccordion>

            <LandingPageAccordion
              dataTestId={dataTestId.registrationLandingPage.externalLinksAccordion}
              defaultExpanded
              heading={t('registration.resource_type.research_data.external_links')}>
              <PublicExternalRelations links={entityDescription.reference.publicationInstance.related} />
            </LandingPageAccordion>
          </>
        )}
        {entityDescription?.reference?.publicationInstance.type === ResearchDataType.DataManagementPlan && (
          <LandingPageAccordion
            dataTestId={dataTestId.registrationLandingPage.externalLinksAccordion}
            defaultExpanded
            heading={t('registration.resource_type.research_data.external_links')}>
            <PublicExternalRelations
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
            <RegistrationList registrations={relatedRegistrations.hits} />
          </LandingPageAccordion>
        )}
      </div>
      <ShareOptions title={mainTitle} description={abstract ?? description ?? ''} />
    </BackgroundDiv>
  );
};
