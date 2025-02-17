import { Box, Chip, Link as MuiLink, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { StyledGeneralInfo } from '../../components/styled/Wrappers';
import { CristinProject } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getLanguageString } from '../../utils/translation-helpers';
import { getResearchProfilePath } from '../../utils/urlPaths';
import { getFullName, getValueByKey } from '../../utils/user-helpers';
import {
  fundingSourceIsNfr,
  getNfrProjectUrl,
  getProjectCoordinatingInstitutionName,
  getProjectManagers,
  getProjectPeriod,
} from '../registration/description_tab/projects_field/projectHelpers';

interface ProjectGeneralInfoProps {
  project: CristinProject;
}

export const ProjectGeneralInfo = ({ project }: ProjectGeneralInfoProps) => {
  const { t } = useTranslation();
  const projectPeriodString = getProjectPeriod(project);
  const projectStatusString = t(`project.status.${project.status}`);
  const projectManager = getProjectManagers(project.contributors)?.[0];

  return (
    <StyledGeneralInfo data-testid={dataTestId.projectLandingPage.generalInfoBox}>
      <Typography component="h2" sx={visuallyHidden}>
        {t('project.about_project')}
      </Typography>
      <div>
        <Typography variant="overline" component="h3">
          {t('project.project_id')}
        </Typography>
        <Typography>{getValueByKey('CristinIdentifier', project.identifiers)}</Typography>
        <Typography variant="overline" component="h3">
          {t('project.coordinating_institution')}
        </Typography>
        <Typography>{getProjectCoordinatingInstitutionName(project) ?? '-'}</Typography>
        <Typography variant="overline" component="h3">
          {t('project.project_manager')}
        </Typography>
        <Typography>
          {projectManager ? (
            projectManager.identity.id ? (
              <MuiLink component={Link} to={getResearchProfilePath(projectManager.identity.id)}>
                {projectManager.identity.firstName} {projectManager.identity.lastName}
              </MuiLink>
            ) : (
              getFullName(projectManager.identity.firstName, projectManager.identity.lastName)
            )
          ) : (
            '-'
          )}
        </Typography>
        <Typography variant="overline" component="h3">
          {t('project.period')}
        </Typography>
        <Typography>{projectPeriodString ? `${projectPeriodString} (${projectStatusString})` : '-'}</Typography>
      </div>
      <div>
        <Typography variant="overline" component="h3">
          {t('common.funding')}
        </Typography>
        {project.funding.length > 0 ? (
          project.funding.map((funding, index) => {
            const sourceName = getLanguageString(funding.labels);
            const fundingText = funding.identifier
              ? `${sourceName} - ${t('project.grant_id')} ${funding.identifier}`
              : sourceName;

            return (
              <Typography key={index}>
                {fundingSourceIsNfr(funding.source) && funding.identifier ? (
                  <MuiLink href={getNfrProjectUrl(funding.identifier)} target="_blank" rel="noopener noreferrer">
                    {fundingText}
                  </MuiLink>
                ) : (
                  fundingText
                )}
              </Typography>
            );
          })
        ) : (
          <Typography>-</Typography>
        )}

        <Typography variant="overline" component="h3">
          {t('project.project_category')}
        </Typography>
        {project.projectCategories.length > 0 ? (
          <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {project.projectCategories.map((category, index) => (
              <Chip key={index} color="primary" label={getLanguageString(category.label)} />
            ))}
          </Box>
        ) : (
          <Typography>-</Typography>
        )}
        <Typography variant="overline" component="h3">
          {t('project.keywords')}
        </Typography>
        {project.keywords.length > 0 ? (
          <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {project.keywords.map((keyword, index) => (
              <Chip key={index} color="primary" label={getLanguageString(keyword.label)} />
            ))}
          </Box>
        ) : (
          <Typography>-</Typography>
        )}
      </div>
    </StyledGeneralInfo>
  );
};
