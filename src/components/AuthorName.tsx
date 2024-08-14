import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface AuthorNameProps {
  authorName: string;
  description?: string;
}

export const AuthorName = ({ description, authorName }: AuthorNameProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        bgcolor: 'secondary.main',
        borderRadius: '0.25rem',
        padding: '0.5rem 0.75rem',
        marginBottom: '2rem',
      }}>
      <Typography>
        {description ?? t('common.contributor')}: <b>{authorName}</b>
      </Typography>
    </Box>
  );
};
