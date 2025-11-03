import { Box, CircularProgress, Link as MuiLink, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { HeadTitle } from '../../components/HeadTitle';
import { RootState } from '../../redux/store';

export const EditorDoi = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);

  return (
    <>
      <HeadTitle>{t('common.doi_long')}</HeadTitle>
      <Typography id="doi-label" variant="h1" gutterBottom>
        {t('common.doi_long')}
      </Typography>
      {!customer ? (
        <CircularProgress aria-labelledby="doi-label" />
      ) : (
        <>
          {!customer.doiAgent.username ? (
            <Typography sx={{ mb: '1rem' }}>
              <Trans t={t} i18nKey="editor.doi.institution_cannot_create_doi">
                <MuiLink href={'mailto:kontakt@sikt.no'} target="_blank" rel="noopener noreferrer" />
              </Trans>
            </Typography>
          ) : (
            <Typography sx={{ mb: '1rem' }}>{t('editor.doi.institution_can_create_doi')}</Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              columnGap: '1rem',
              width: '100%',
            }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                rowGap: '0.3rem',
                width: 'max(30%, 250px)',
              }}>
              <Typography variant="h2">{t('basic_data.institutions.doi_repo_id')}:</Typography>
              {customer.doiAgent?.username ? (
                <Typography sx={{ bgcolor: 'grey.400', p: '0.7rem' }}>{customer.doiAgent.username}</Typography>
              ) : (
                '—'
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                rowGap: '0.3rem',
                width: 'max(30%, 250px)',
              }}>
              <Typography variant="h2">{t('basic_data.institutions.institution_doi_prefix')}:</Typography>
              {customer.doiAgent?.prefix ? (
                <Typography sx={{ bgcolor: 'grey.400', p: '0.7rem' }}>{customer.doiAgent.prefix}</Typography>
              ) : (
                '—'
              )}
            </Box>
          </Box>

          <Box component="ul" sx={{ pl: '1rem' }}>
            {t(`editor.doi.doi_information_bullet_points`)
              .split('|')
              .map((item) => (
                <li key={item}>{item}</li>
              ))}
          </Box>
          <Box component="ul" sx={{ pl: '1rem' }}>
            {t(`editor.doi.doi_information_bullet_points_2`)
              .split('|')
              .map((item) => (
                <li key={item}>{item}</li>
              ))}
          </Box>
        </>
      )}
    </>
  );
};
