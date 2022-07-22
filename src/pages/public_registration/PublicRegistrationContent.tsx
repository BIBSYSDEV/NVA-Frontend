import { useTranslation } from 'react-i18next';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box } from '@mui/material';
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
import { RegistrationFieldName } from '../../types/publicationFieldNames';
import { SearchResponse } from '../../types/common.types';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { FilesLandingPageAccordion } from './public_files/FilesLandingPageAccordion';

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
  const mainTitle = entityDescription?.mainTitle || `[${t('common.missing_title')}]`;
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
                {t(`publicationTypes:${entityDescription.reference.publicationInstance.type}`)}
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
        {contributors.length > 0 && (
          <PublicRegistrationContributors
            contributors={contributors}
            registrationType={entityDescription?.reference?.publicationInstance.type ?? ''}
          />
        )}

        <PublicGeneralContent registration={registration} />

        <FilesLandingPageAccordion registration={registration} />

        {entityDescription && (abstract || description || entityDescription.tags.length > 0 || subjects.length > 0) && (
          <LandingPageAccordion
            data-testid={dataTestId.registrationLandingPage.abstractAccordion}
            defaultExpanded
            heading={t('registration.description.abstract')}>
            <PublicSummaryContent registration={registration} />
          </LandingPageAccordion>
        )}

        {projects.length > 0 && (
          <LandingPageAccordion
            data-testid={dataTestId.registrationLandingPage.projectsAccordion}
            defaultExpanded
            heading={t('registration.description.project_association')}>
            <PublicProjectsContent projects={projects} />
          </LandingPageAccordion>
        )}

        {relatedRegistrations && relatedRegistrations.hits.length > 0 && (
          <LandingPageAccordion
            data-testid={dataTestId.registrationLandingPage.relatedRegistrationsAccordion}
            defaultExpanded
            heading={t('registration.public_page.related_registrations')}>
            <RegistrationList registrations={relatedRegistrations.hits} />
          </LandingPageAccordion>
        )}
      </div>
      <ShareOptions title={mainTitle} description={abstract ?? description ?? ''} />
    </BackgroundDiv>
  );
};
