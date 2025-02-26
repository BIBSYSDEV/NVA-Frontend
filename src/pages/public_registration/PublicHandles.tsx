import { Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { PublicPageInfoEntry } from './PublicPageInfoEntry';
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
    <PublicPageInfoEntry
      title={t('registration.public_page.handle')}
      content={
        <>
          {handles.map((handle) => (
            <Typography component="dd" key={handle} gridColumn={2}>
              <MuiLink
                data-testid={dataTestId.registrationLandingPage.handleLink}
                href={handle}
                target="_blank"
                rel="noopener noreferrer">
                {handle}
              </MuiLink>
            </Typography>
          ))}
        </>
      }
    />
  );
};
