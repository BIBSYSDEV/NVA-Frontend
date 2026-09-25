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

  const { primaryHandles, otherHandles } = splitHandles(getHandles(registration));
  const cristinIdentifier = getCristinIdentifier(registration);
  const scopusIdentifiers = getScopusIdentifiers(registration);

  return (
    <>
      <PublicDoi registration={registration} />
      <PublicHandles handles={primaryHandles} />

      {/* Note: Must not unmount when collapsed, since aria-controls has to reference an existing element */}
      <Collapse in={showAllIdentifiers} id={hiddenIdentifiersId} timeout="auto">
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
          <PublicPageInfoEntry title={t('registration.public_page.scopus_id')} content={scopusIdentifiers.join(', ')} />
        )}
        <PublicPageInfoEntry title={t('registration.registration_id')} content={registration.identifier} />
      </Collapse>

      {/* Note: The toggle is always shown, since every registration has an identifier to reveal.
          The Box keeps the button from being an invalid direct child of the surrounding <dl> */}
      <Box>
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
    </>
  );
};
