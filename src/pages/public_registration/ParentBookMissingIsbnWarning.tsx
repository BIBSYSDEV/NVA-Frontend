import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Button, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { BookPublicationContext } from '../../types/publication_types/bookRegistration.types';
import { ChapterPublicationContext } from '../../types/publication_types/chapterRegistration.types';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { isChapter, nviApplicableTypes, userHasAccessRight } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';

interface ParentBookMissingIsbnWarningProps {
  registration: Registration;
}

export const ParentBookMissingIsbnWarning = ({ registration }: ParentBookMissingIsbnWarningProps) => {
  const { t } = useTranslation();

  const reference = registration.entityDescription?.reference;
  const instanceType = reference?.publicationInstance?.type;
  const isNviApplicableChapter = isChapter(instanceType) && !!instanceType && nviApplicableTypes.includes(instanceType);
  const userCanEditRegistration = userHasAccessRight(registration, 'partial-update');

  const parentBookId = isNviApplicableChapter ? (reference?.publicationContext as ChapterPublicationContext).id : '';
  const parentBookIdentifier = parentBookId ? getIdentifierFromId(parentBookId) : '';
  const parentBookQuery = useFetchRegistration(parentBookIdentifier, { enabled: userCanEditRegistration });

  const parentBookPublicationContext = parentBookQuery.data?.entityDescription?.reference?.publicationContext as
    BookPublicationContext | undefined;
  const parentBookHasIsbn = (parentBookPublicationContext?.isbnList ?? []).filter(Boolean).length > 0;

  if (!userCanEditRegistration || !parentBookQuery.data || parentBookHasIsbn) {
    return null;
  }

  return (
    <Box
      data-testid={dataTestId.registrationLandingPage.parentBookMissingIsbnWarning}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        textAlign: 'center',
        p: '1rem',
        mb: '1rem',
        bgcolor: 'warning.light',
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <WarningIcon color="warning" fontSize="small" />
        <Typography sx={{ fontWeight: 'bold' }}>{t('missing_isbn_on_linked_book')}</Typography>
      </Box>
      <Trans t={t} i18nKey="linked_book_missing_isbn_description" components={{ p: <Typography /> }} />
      <Button
        variant="contained"
        color="secondary"
        size="small"
        endIcon={<ArrowForwardIcon />}
        component={RouterLink}
        to={getRegistrationLandingPagePath(parentBookIdentifier)}
        data-testid={dataTestId.registrationLandingPage.goToParentBookButton}>
        {t('go_to_book')}
      </Button>
    </Box>
  );
};
