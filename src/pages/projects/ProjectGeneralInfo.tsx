import { Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledGeneralInfo } from '../../components/styled/Wrappers';
import { CristinProject } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getLanguageString } from '../../utils/translation-helpers';
import {
  getNfrProjectUrl,
  getProjectCoordinatingInstitutionName,
  getProjectManagerName,
  getProjectPeriod,
} from '../registration/description_tab/projects_field/projectHelpers';

interface ProjectGeneralInfoProps {
  project: CristinProject;
}

export const ProjectGeneralInfo = ({ project }: ProjectGeneralInfoProps) => {
  const { t } = useTranslation();
  const projectPeriodString = getProjectPeriod(project);
  const projectStatusString = t(`project.status.${project.status}`);

  return (
    <StyledGeneralInfo data-testid={dataTestId.projectLandingPage.generalInfoBox}>
      <div>
        <Typography variant="overline">{t('project.coordinating_institution')}</Typography>
        <Typography>{getProjectCoordinatingInstitutionName(project) ?? '-'}</Typography>
        <Typography variant="overline">{t('project.project_manager')}</Typography>
        <Typography>{getProjectManagerName(project) ?? '-'}</Typography>
        <Typography variant="overline">{t('project.period')}</Typography>
        <Typography>{projectPeriodString ? `${projectPeriodString} (${projectStatusString})` : '-'}</Typography>
      </div>
      <div>
        <Typography variant="overline">{t('project.financing')}</Typography>
        {project.funding.length > 0 ? (
          project.funding.map((funding, index) => {
            const sourceName = getLanguageString(funding.source.names);
            const fundingText = funding.code ? `${sourceName} - ${t('project.grant_id')} ${funding.code}` : sourceName;

            return (
              <Typography key={index}>
                {funding.source.code === 'NFR' && funding.code ? (
                  <Link href={getNfrProjectUrl(funding.code)} target="_blank" rel="noopener noreferrer">
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

        <Typography variant="overline">{t('project.project_category')}</Typography>
        <Typography>
          {project.projectCategories.length > 0
            ? project.projectCategories.map((category) => getLanguageString(category.label)).join(', ')
            : '-'}
        </Typography>
        <Typography variant="overline">{t('project.keywords')}</Typography>
        <Typography>
          {project.keywords.length > 0
            ? project.keywords.map((keyword) => getLanguageString(keyword.label)).join(', ')
            : '-'}
        </Typography>
      </div>
    </StyledGeneralInfo>
  );
};
