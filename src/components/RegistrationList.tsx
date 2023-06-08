import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Box, Link as MuiLink, List, ListItemText, Typography } from '@mui/material';
import { getRegistrationLandingPagePath, getResearchProfilePath } from '../utils/urlPaths';
import { Registration } from '../types/registration.types';
import { ErrorBoundary } from './ErrorBoundary';
import { dataTestId } from '../utils/dataTestIds';
import { getTitleString } from '../utils/registration-helpers';
import { displayDate } from '../utils/date-helpers';
import { TruncatableTypography } from './TruncatableTypography';
import { ContributorIndicators } from './ContributorIndicators';
import { SearchListItem } from './styled/Wrappers';

interface RegistrationListProps {
  registrations: Registration[];
}

export const RegistrationList = ({ registrations }: RegistrationListProps) => (
  <List disablePadding>
    {registrations.map((registration) => (
      <ErrorBoundary key={registration.id}>
        <SearchListItem sx={{ borderLeftColor: 'registration.main' }}>
          <RegistrationListItemContent registration={registration} />
        </SearchListItem>
      </ErrorBoundary>
    ))}
  </List>
);

interface RegistrationListItemContentProps {
  registration: Registration;
  linkPath?: string;
  disableLinks?: boolean;
}

export const RegistrationListItemContent = ({
  registration,
  linkPath,
  disableLinks = false,
}: RegistrationListItemContentProps) => {
  const { t } = useTranslation();
  const { identifier, entityDescription } = registration;

  const contributors = entityDescription?.contributors ?? [];
  const focusedContributors = contributors.slice(0, 5);
  const countRestContributors = contributors.length - focusedContributors.length;

  const typeString = entityDescription?.reference?.publicationInstance?.type
    ? t(`registration.publication_types.${entityDescription.reference.publicationInstance.type}`)
    : '';

  const publicationDate = displayDate(entityDescription?.publicationDate);
  const heading = [typeString, publicationDate].filter(Boolean).join(' — ');

  return (
    <ListItemText disableTypography data-testid={dataTestId.startPage.searchResultItem}>
      <Typography variant="overline" sx={{ color: 'primary.main', display: 'flex', gap: '0.25rem' }}>
        {heading}
      </Typography>
      <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', wordWrap: 'break-word' }}>
        {disableLinks ? (
          getTitleString(entityDescription?.mainTitle)
        ) : (
          <MuiLink component={Link} to={getRegistrationLandingPagePath(identifier)}>
            {getTitleString(entityDescription?.mainTitle)}
          </MuiLink>
        )}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '1rem',
          whiteSpace: 'nowrap',
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '1rem', flexWrap: 'wrap' }}>
          {focusedContributors.map((contributor, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                {contributor.identity.id && !disableLinks ? (
                  <MuiLink component={Link} to={getResearchProfilePath(contributor.identity.id)}>
                    {contributor.identity.name}
                  </MuiLink>
                ) : (
                  contributor.identity.name
                )}
              </Typography>
              <ContributorIndicators contributor={contributor} disableLinks={disableLinks} />
            </Box>
          ))}
          {countRestContributors > 0 && (
            <Typography variant="body2">({t('common.x_others', { count: countRestContributors })})</Typography>
          )}
        </Box>
      </Box>

      <TruncatableTypography sx={{ mt: '0.5rem' }}>{entityDescription?.abstract}</TruncatableTypography>
    </ListItemText>
  );
};
