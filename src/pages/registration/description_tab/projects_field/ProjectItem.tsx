import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Divider, IconButton, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { useFetchProject } from '../../../../api/hooks/useFetchProject';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { OpenInNewLink } from '../../../../components/OpenInNewLink';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { getProjectPath } from '../../../../utils/urlPaths';
import { fundingSourceIsNfr, getNfrProjectUrl } from './projectHelpers';

interface ProjectItemProps {
  projectId: string;
  removeProject: (projectId: string) => void;
}

const StyledListSkeleton = () => <ListSkeleton arrayLength={1} minWidth={20} height={20} />;

export const ProjectItem = ({ projectId, removeProject }: ProjectItemProps) => {
  const { t } = useTranslation();
  const projectQuery = useFetchProject(projectId, { keepPreviousData: true }); // TODO: Why keepPreviousData?
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Typography fontWeight="bold">{t('project.project').toUpperCase()}</Typography>
        <div>
          <Typography fontWeight="bold">{t('common.title')}:</Typography>
          {isFetching ? (
            <StyledListSkeleton />
          ) : project ? (
            <OpenInNewLink
              component={RouterLink}
              to={getProjectPath(project.id)}
              data-testid={dataTestId.registrationWizard.description.projectLink(project.id)}>
              {project.title}
            </OpenInNewLink>
          ) : (
            <Typography>-</Typography>
          )}
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Typography fontWeight="bold">{t('common.funding').toUpperCase()}</Typography>
        {project?.funding?.length ? (
          project.funding.map((funding, index) => (
            <Box
              key={`${funding.identifier}-${index}`}
              sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {index > 0 && <Divider sx={{ width: '50%' }} />}
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
                    <MuiLink
                      sx={{ display: 'flex', gap: '1rem' }}
                      data-testid={dataTestId.registrationWizard.description.nfrProjectLink(funding.identifier)}
                      href={getNfrProjectUrl(funding.identifier)}
                      target="_blank"
                      rel="noopener noreferrer">
                      {funding.identifier}
                      <OpenInNewIcon fontSize="small" />
                    </MuiLink>
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
