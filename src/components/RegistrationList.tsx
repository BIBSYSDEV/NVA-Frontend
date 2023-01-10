import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Box, Link as MuiLink, List, ListItem, ListItemText, Typography } from '@mui/material';
import { getRegistrationLandingPagePath, getResearchProfilePath } from '../utils/urlPaths';
import { Registration } from '../types/registration.types';
import { ErrorBoundary } from './ErrorBoundary';
import { dataTestId } from '../utils/dataTestIds';
import { getTitleString } from '../utils/registration-helpers';
import { displayDate } from '../utils/date-helpers';
import { TruncatableTypography } from './TruncatableTypography';

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

export const RegistrationListItem = ({ registration }: RegistrationListItemProps) => {
  const { t } = useTranslation();
  const { identifier, entityDescription } = registration;

  const contributors = entityDescription?.contributors ?? [];
  const focusedContributors = contributors.slice(0, 5);
  const countRestContributors = contributors.length - focusedContributors.length;

  return (
    <ListItem
      sx={{
        border: '2px solid',
        borderLeft: '1.25rem solid',
        borderColor: 'registration.main',
      }}>
      <ListItemText disableTypography data-testid={dataTestId.startPage.searchResultItem}>
        <Typography variant="overline" sx={{ color: 'primary.main' }}>
          {entityDescription?.reference?.publicationInstance.type
            ? t(`registration.publication_types.${entityDescription.reference.publicationInstance.type}`)
            : '?'}{' '}
          — {displayDate(entityDescription?.date)}
        </Typography>
        <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', wordWrap: 'break-word' }}>
          <MuiLink component={Link} to={getRegistrationLandingPagePath(identifier)}>
            {getTitleString(entityDescription?.mainTitle)}
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
                <MuiLink component={Link} to={getResearchProfilePath(contributor.identity.id)}>
                  {contributor.identity.name}
                </MuiLink>
              ) : (
                contributor.identity.name
              )}
            </Typography>
          ))}
          {countRestContributors > 0 && (
            <Typography variant="body2">({t('common.x_others', { count: countRestContributors })})</Typography>
          )}
        </Box>

        <TruncatableTypography>{entityDescription?.abstract}</TruncatableTypography>
      </ListItemText>
    </ListItem>
  );
};
