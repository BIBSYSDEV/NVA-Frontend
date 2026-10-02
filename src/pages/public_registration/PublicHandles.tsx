import { Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { PublicPageInfoEntry } from './PublicPageInfoEntry';

interface PublicHandlesProps {
  handles: string[];
}

export const PublicHandles = ({ handles }: PublicHandlesProps) => {
  const { t } = useTranslation();

  if (handles.length === 0) {
    return null;
  }

  return (
    <PublicPageInfoEntry
      title={t('registration.public_page.handle')}
      content={
        <>
          {handles.map((handle) => (
            <Typography
              component="dd"
              key={handle}
              sx={{
                gridColumn: 2,
              }}>
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
