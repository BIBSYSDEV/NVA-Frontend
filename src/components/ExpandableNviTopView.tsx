import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Typography } from '@mui/material';
import { ReactNode, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ExpandableNviTopViewProps {
  alwaysVisibleText: string;
  expandedText: string;
  testId: string;
  children?: ReactNode;
}

export const ExpandableNviTopView = ({
  alwaysVisibleText,
  expandedText,
  testId,
  children,
}: ExpandableNviTopViewProps) => {
  const { t } = useTranslation();
  const [textExpanded, setTextExpanded] = useState(false);
  const expandedTextId = useId();

  return (
    <Box sx={{ mb: '1rem' }}>
      <Typography>{alwaysVisibleText}</Typography>
      <Button
        variant="text"
        onClick={() => setTextExpanded(!textExpanded)}
        aria-expanded={textExpanded}
        aria-controls={expandedTextId}
        data-testid={testId}
        endIcon={textExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{ textDecoration: 'underline', justifyContent: 'flex-start', p: 0, my: '0.5rem', mb: '1rem' }}>
        {textExpanded ? t('common.read_less') : t('common.read_more')}
      </Button>
      <Typography id={expandedTextId} sx={{ display: textExpanded ? 'block' : 'none', mb: '1rem' }}>
        {expandedText}
      </Typography>
      {children}
    </Box>
  );
};
