import { Box, Chip, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledGeneralInfo } from '../../components/styled/Wrappers';
import { CristinProject } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getLanguageString } from '../../utils/translation-helpers';
import { getValueByKey } from '../../utils/user-helpers';
import {
  fundingSourceIsNfr,
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
        <Typography variant="overline">{t('project.project_id')}</Typography>
        <Typography>{getValueByKey('CristinIdentifier', project.identifiers)}</Typography>
        <Typography variant="overline">{t('project.coordinating_institution')}</Typography>
        <Typography>{getProjectCoordinatingInstitutionName(project) ?? '-'}</Typography>
        <Typography variant="overline">{t('project.project_manager')}</Typography>
        <Typography>{getProjectManagerName(project) ?? '-'}</Typography>
        <Typography variant="overline">{t('project.period')}</Typography>
        <Typography>{projectPeriodString ? `${projectPeriodString} (${projectStatusString})` : '-'}</Typography>
      </div>
      <div>
        <Typography variant="overline">{t('common.funding')}</Typography>
        {project.funding.length > 0 ? (
          project.funding.map((funding, index) => {
            const sourceName = getLanguageString(funding.labels);
            const fundingText = funding.identifier
              ? `${sourceName} - ${t('project.grant_id')} ${funding.identifier}`
              : sourceName;

            return (
              <Typography key={index}>
                {fundingSourceIsNfr(funding.source) && funding.identifier ? (
                  <Link href={getNfrProjectUrl(funding.identifier)} target="_blank" rel="noopener noreferrer">
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
        {project.projectCategories.length > 0 ? (
          <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {project.projectCategories.map((category, index) => (
              <Chip key={index} color="primary" label={getLanguageString(category.label)} />
            ))}
          </Box>
        ) : (
          <Typography>-</Typography>
        )}
        <Typography variant="overline">{t('project.keywords')}</Typography>
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
