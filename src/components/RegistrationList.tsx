import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Box, Link as MuiLink, List, ListItem, ListItemText, Typography } from '@mui/material';
import { displayDate } from '../utils/date-helpers';
import { getRegistrationLandingPagePath, getUserPath } from '../utils/urlPaths';
import { Registration } from '../types/registration.types';
import { ErrorBoundary } from './ErrorBoundary';
import { TruncateableTypography } from './TruncatableTypography';

interface RegistrationListProps {
  registrations: Registration[];
}

export const RegistrationList = ({ registrations }: RegistrationListProps) => (
  <List>
    {registrations.map((registration) => (
      <ErrorBoundary key={registration.id}>
        <RegistrationListItem registration={registration} />
      </ErrorBoundary>
    ))}
  </List>
);

interface RegistrationListItemProps {
  registration: Registration;
}

const RegistrationListItem = ({ registration }: RegistrationListItemProps) => {
  const { t } = useTranslation('publicationTypes');
  const { identifier, entityDescription } = registration;

  const contributors = entityDescription?.contributors ?? [];
  const focusedContributors = contributors.slice(0, 5);
  const countRestContributors = contributors.length - focusedContributors.length;

  return (
    <ListItem divider disableGutters>
      <ListItemText disableTypography data-testid="result-list-item">
        <Typography variant="overline" sx={{ color: 'primary.dark' }}>
          {t(entityDescription?.reference?.publicationInstance.type ?? '')} - {displayDate(entityDescription?.date)}
        </Typography>
        <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', fontStyle: 'italic' }}>
          <MuiLink component={Link} to={getRegistrationLandingPagePath(identifier)}>
            {entityDescription?.mainTitle}
          </MuiLink>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '1rem',
            whiteSpace: 'nowrap',
          }}>
          {focusedContributors.map((contributor, index) => (
            <Typography key={index} variant="body2">
              {contributor.identity.id ? (
                <MuiLink component={Link} to={getUserPath(contributor.identity.id)}>
                  {contributor.identity.name}
                </MuiLink>
              ) : (
                contributor.identity.name
              )}
            </Typography>
          ))}
          {countRestContributors > 0 && (
            <Typography variant="body2">({t('common:x_others', { count: countRestContributors })})</Typography>
          )}
        </Box>

        <TruncateableTypography lines={2}>{entityDescription?.abstract}</TruncateableTypography>
      </ListItemText>
    </ListItem>
  );
};
