import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, Collapse, Link, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelperTextModal } from '../../registration/HelperTextModal';

export const UserOrcidHelperModal = () => {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);

  return (
    <HelperTextModal modalTitle={t('my_page.my_profile.orcid.helper_text_modal.modal_title')}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography>{t('my_page.my_profile.orcid.helper_text_modal.introduction')}</Typography>
        <Button
          sx={{ alignSelf: 'center' }}
          endIcon={showMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setShowMore(!showMore)}>
          {showMore ? t('common.read_less') : t('common.read_more')}
        </Button>
        <Collapse in={showMore}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', my: '0.5rem' }}>
            <Typography sx={{ mb: '1rem' }}>
              {t('my_page.my_profile.orcid.helper_text_modal.detailed_paragraph_1')}
            </Typography>
            <Typography sx={{ mb: '1rem' }}>
              {t('my_page.my_profile.orcid.helper_text_modal.detailed_paragraph_2')}
            </Typography>

            <Link
              sx={{
                display: 'flex',
                gap: '0.5rem',
                textDecoration: 'none',
                fontStyle: 'italic',
                width: 'fit-content',
              }}
              rel="noopener noreferrer"
              href="https://orcid.org">
              {t('my_page.my_profile.orcid.helper_text_modal.link')}
              <OpenInNewIcon fontSize="small" />
            </Link>
          </Box>
        </Collapse>
      </Box>
    </HelperTextModal>
  );
};
