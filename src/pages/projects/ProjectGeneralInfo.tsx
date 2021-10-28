import { Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledGeneralInfo } from '../../components/landing_page/SyledGeneralInfo';
import { CristinProject } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getLanguageString } from '../../utils/translation-helpers';
import {
  getProjectName,
  getProjectManagerName,
  getProjectPeriod,
} from '../registration/description_tab/projects_field/projectHelpers';

interface ProjectGeneralInfoProps {
  project: CristinProject;
}

export const ProjectGeneralInfo = ({ project }: ProjectGeneralInfoProps) => {
  const { t } = useTranslation('project');

  return (
    <StyledGeneralInfo data-testid={dataTestId.projectLandingPage.generalInfoBox}>
      <div>
        <Typography variant="overline" component="h2">
          {t('project_owner')}
        </Typography>
        <Typography>{getProjectName(project) ?? '-'}</Typography>
        <Typography variant="overline" component="h2">
          {t('project_manager')}
        </Typography>
        <Typography>{getProjectManagerName(project) ?? '-'}</Typography>
        <Typography variant="overline" component="h2">
          {t('period')}
        </Typography>
        <Typography>{getProjectPeriod(project) ?? '-'}</Typography>
      </div>
      <div>
        <Typography variant="overline" component="h2">
          {t('financing')}
        </Typography>
        {project.funding.length > 0 ? (
          project.funding.map((funding) => {
            const sourceName = getLanguageString(funding.source.names);
            const fundingText = funding.code ? `${sourceName} - ${t('grant_id')} ${funding.code}` : sourceName;
            return (
              <Typography key={funding.code}>
                {funding.source.code === 'NFR' ? (
                  <Link
                    href={`https://prosjektbanken.forskningsradet.no/project/FORISS/${funding.code}`}
                    target="_blank">
                    {fundingText}
                  </Link>
                ) : (
                  fundingText
                )}
              </Typography>
            );
          })
        ) : (
          <Typography>-</Typography>
        )}
      </div>
    </StyledGeneralInfo>
  );
};
