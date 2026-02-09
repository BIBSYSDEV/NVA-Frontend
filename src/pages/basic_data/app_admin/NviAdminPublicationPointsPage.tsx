import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NviStatusWrapper } from '../../messages/components/NviStatusWrapper';

export const NviAdminPublicationPointsPage = () => {
  const { t } = useTranslation();
  const [textExpanded, setTextExpanded] = useState(false);
  const detailsId = 'publication-points-details';

  return (
    <NviStatusWrapper
      headline={t('basic_data.nvi.publication_points_status')}
      topView={
        <Box sx={{ mb: '1rem' }}>
          <Typography>{t('publication_points_description')}</Typography>
          <Button
            variant="text"
            onClick={() => setTextExpanded((prev) => !prev)}
            aria-expanded={textExpanded}
            aria-controls={detailsId}
            endIcon={textExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ textDecoration: 'underline', justifyContent: 'flex-start', p: 0, minWidth: 0, my: '0.5rem' }}>
            {textExpanded ? t('common.read_less') : t('common.read_more')}
          </Button>
          {textExpanded && <Typography id={detailsId}>{t('publication_points_description_more')}</Typography>}
        </Box>
      }
    />
  );
};
