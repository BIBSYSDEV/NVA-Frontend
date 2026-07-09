import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { ResearchDataPublicationInstance } from '../../../types/publication_types/researchDataRegistration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { PublicPageInfoEntry } from '../PublicPageInfoEntry';

export const PublicPublicationInstanceSoftwareSourceCode = ({
  publicationInstance,
}: {
  publicationInstance: ResearchDataPublicationInstance;
}) => {
  const { t } = useTranslation();
  const { codeRepository, softwareVersion } = publicationInstance;

  return (
    <>
      {softwareVersion && (
        <PublicPageInfoEntry title={t('registration.resource_type.research_data.version')} content={softwareVersion} />
      )}
      {codeRepository && (
        <PublicPageInfoEntry
          title={t('registration.resource_type.research_data.repository_url')}
          content={
            <Typography component="dd" gridColumn={2}>
              <OpenInNewLink href={codeRepository} data-testid={dataTestId.registrationLandingPage.codeRepositoryLink}>
                {codeRepository}
              </OpenInNewLink>
            </Typography>
          }
        />
      )}
    </>
  );
};
