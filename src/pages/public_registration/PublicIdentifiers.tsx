import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Collapse, Link, Typography } from '@mui/material';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../utils/dataTestIds';
import { getCristinIdentifier, getHandles, getScopusIdentifiers, splitHandles } from './_utils/identifier-helpers';
import { PublicDoi } from './PublicDoi';
import { PublicHandles } from './PublicHandles';
import { PublicPageInfoEntry } from './PublicPageInfoEntry';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const PublicIdentifiers = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();
  const [showAllIdentifiers, setShowAllIdentifiers] = useState(false);
  const hiddenIdentifiersId = useId();

  const { primaryHandle, otherHandles } = splitHandles(getHandles(registration));
  const cristinIdentifier = getCristinIdentifier(registration);
  const scopusIdentifiers = getScopusIdentifiers(registration);

  return (
    // Note: Renders its own <dl>s, since Collapse and the toggle would be invalid children of a <dl>.
    // The bottom margin matches the default <dl> margin the list above leaves out.
    <Box sx={{ mb: '1em' }}>
      <Box component="dl" sx={{ m: 0 }}>
        <PublicDoi registration={registration} />
        <PublicHandles handles={primaryHandle ? [primaryHandle] : []} />
      </Box>

      {/* Note: Must not unmount when collapsed, since aria-controls has to reference an existing element */}
      <Collapse in={showAllIdentifiers} id={hiddenIdentifiersId} timeout="auto">
        <Box component="dl" sx={{ m: 0 }}>
          <PublicHandles handles={otherHandles} />
          {cristinIdentifier && (
            <PublicPageInfoEntry
              title={t('registration.public_page.cristin_id')}
              content={
                <Typography
                  component="dd"
                  sx={{
                    gridColumn: 2,
                  }}>
                  <Link
                    href={`https://app.cristin.no/results/show.jsf?id=${cristinIdentifier}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    {cristinIdentifier}
                  </Link>
                </Typography>
              }
            />
          )}
          {scopusIdentifiers.length > 0 && (
            <PublicPageInfoEntry
              title={t('registration.public_page.scopus_id')}
              content={scopusIdentifiers.join(', ')}
            />
          )}
          <PublicPageInfoEntry title={t('registration.registration_id')} content={registration.identifier} />
        </Box>
      </Collapse>

      {/* Note: The toggle is always shown, since every registration has an identifier to reveal */}
      <Button
        data-testid={dataTestId.registrationLandingPage.toggleIdentifiersButton}
        variant="text"
        size="small"
        onClick={() => setShowAllIdentifiers(!showAllIdentifiers)}
        aria-expanded={showAllIdentifiers}
        aria-controls={hiddenIdentifiersId}
        endIcon={showAllIdentifiers ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{ textDecoration: 'underline', justifyContent: 'flex-start', p: 0, mt: '0.5rem' }}>
        {showAllIdentifiers
          ? t('registration.public_page.show_fewer_ids')
          : t('registration.public_page.show_more_ids')}
      </Button>
    </Box>
  );
};
