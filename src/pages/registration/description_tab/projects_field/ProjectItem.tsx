import { useTranslation } from 'react-i18next';
import { useFetchProjectQuery } from '../../../../utils/hooks/useFetchProjectQuery';
import { Box, IconButton, Link as MuiLink, Typography } from '@mui/material';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getProjectPath } from '../../../../utils/urlPaths';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { fundingSourceIsNfr, getNfrProjectUrl } from './projectHelpers';
import CancelIcon from '@mui/icons-material/Cancel';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { Link } from 'react-router-dom';

interface ProjectItemProps {
  projectId: string;
  removeProject: (projectId: string) => void;
}

const StyledListSkeleton = () => <ListSkeleton arrayLength={1} minWidth={20} height={20} />;

export const ProjectItem = ({ projectId, removeProject }: ProjectItemProps) => {
  const { t } = useTranslation();
  const projectQuery = useFetchProjectQuery(projectId);
  const project = projectQuery.data;
  const isFetching = projectQuery.isFetching;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { sm: '1fr', md: '1fr 1fr auto' },
        gap: '1rem',
        bgcolor: 'secondary.light',
        p: '1rem',
        border: '1px solid lightgray',
        borderRadius: '8px',
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography fontWeight="bold">{t('project.project').toUpperCase()}</Typography>
        <Box sx={{ display: 'grid', gridTemplateRows: '1fr auto', gap: '1rem', height: '100%' }}>
          <div>
            <Typography fontWeight="bold">{t('common.title')}:</Typography>
            <Box sx={{ display: 'flex', gap: '2rem' }}>
              {isFetching ? (
                <StyledListSkeleton />
              ) : project ? (
                <MuiLink
                  sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
                  component={Link}
                  data-testid={dataTestId.registrationWizard.description.projectLink(project?.id)}
                  to={getProjectPath(project.id)}
                  target="_blank"
                  rel="noopener noreferrer">
                  {project.title}
                  <OpenInNewIcon fontSize="small" />
                </MuiLink>
              ) : (
                <Typography>-</Typography>
              )}
            </Box>
          </div>
          <div>
            <Typography fontWeight="bold">{t('project.coordinating_institution')}:</Typography>
            {isFetching ? (
              <StyledListSkeleton />
            ) : project?.coordinatingInstitution ? (
              <Typography>{getLanguageString(project.coordinatingInstitution.labels)}</Typography>
            ) : (
              <Typography>-</Typography>
            )}
          </div>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography fontWeight="bold">{t('common.funding').toUpperCase()}</Typography>
        {project?.funding?.length ? (
          project.funding.map((funding) => (
            <Box
              key={funding.identifier}
              sx={{ display: 'grid', gridTemplateRows: '1fr auto', gap: '1rem', height: '100%' }}>
              <div>
                <Typography fontWeight="bold">{t('registration.description.funding.funder')}:</Typography>
                {isFetching ? <StyledListSkeleton /> : <Typography>{getLanguageString(funding.labels)}</Typography>}
              </div>
              <div>
                <Typography fontWeight="bold">{t('project.grant_id')}:</Typography>
                {isFetching ? (
                  <StyledListSkeleton />
                ) : funding.identifier ? (
                  fundingSourceIsNfr(funding.source) ? (
                    <Box sx={{ display: 'flex', gap: '2rem', height: 'fit-content' }}>
                      <MuiLink
                        sx={{ display: 'flex', gap: '1rem' }}
                        component={Link}
                        data-testid={dataTestId.registrationWizard.description.nfrProjectLink(funding.identifier)}
                        to={getNfrProjectUrl(funding.identifier)}
                        target="_blank"
                        rel="noopener noreferrer">
                        {funding.identifier}
                        <OpenInNewIcon fontSize="small" />
                      </MuiLink>
                    </Box>
                  ) : (
                    <Typography>{funding.identifier}</Typography>
                  )
                ) : (
                  <Typography>-</Typography>
                )}
              </div>
            </Box>
          ))
        ) : (
          <Typography fontStyle="italic">{t('project.project_has_no_funding')}</Typography>
        )}
      </Box>
      <IconButton
        size="small"
        sx={{ alignSelf: 'center' }}
        color="primary"
        onClick={() => removeProject(projectId)}
        title={t('common.remove')}
        data-testid={dataTestId.registrationWizard.description.removeProjectButton}>
        <CancelIcon />
      </IconButton>
    </Box>
  );
};
