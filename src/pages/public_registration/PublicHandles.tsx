import { Box, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const PublicHandles = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();

  const additionalHandles =
    registration.additionalIdentifiers
      ?.filter((identifier) => identifier.type === 'HandleIdentifier' || identifier.sourceName === 'handle')
      .map((identifier) => identifier.value) ?? [];
  const handles = [...new Set([registration.handle, ...additionalHandles].filter(Boolean))];

  if (handles.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="overline">{t('registration.public_page.handle')}</Typography>
      <Box component="ul" sx={{ p: 0, m: 0, listStyleType: 'none' }}>
        {handles.map((handle) => (
          <li key={handle}>
            <MuiLink
              data-testid={dataTestId.registrationLandingPage.handleLink}
              href={handle}
              target="_blank"
              rel="noopener noreferrer">
              {handle}
            </MuiLink>
          </li>
        ))}
      </Box>
    </>
  );
};
