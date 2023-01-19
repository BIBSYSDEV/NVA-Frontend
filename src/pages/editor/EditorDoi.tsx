import { CircularProgress, Typography, Link as MuiLink, Box } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export const EditorDoi = () => {
  const { t } = useTranslation();
  const { customer } = useSelector((store: RootState) => store);

  return (
    <>
      <Typography id="doi-label" variant="h2" sx={{ mb: '2rem' }}>
        {t('common.doi_long')}
      </Typography>
      {!customer ? (
        <CircularProgress aria-labelledby="doi-label" />
      ) : (
        <>
          {!customer.doiAgent.username ? (
            <Typography paragraph>
              <Trans t={t} i18nKey="editor.doi.institution_cannot_create_doi">
                <MuiLink href={'mailto:kontakt@sikt.no'} target="_blank" rel="noopener noreferrer" />
              </Trans>
            </Typography>
          ) : (
            <Typography paragraph>{t('editor.doi.institution_can_create_doi')}</Typography>
          )}

          <Box
            sx={{
              bgcolor: 'grey.400',
              width: 'fit-content',
              p: '1rem 2rem',
              display: 'flex',
              gap: '3rem',
              'h3, p': {
                fontSize: '1rem',
                fontWeight: 500,
              },
            }}>
            <div>
              <Typography variant="h3">{t('basic_data.institutions.doi_repo_id')}</Typography>
              {customer.doiAgent?.username ? (
                <Typography sx={{ color: 'primary.light' }}>{customer.doiAgent.username}</Typography>
              ) : (
                '—'
              )}
            </div>
            <div>
              <Typography variant="h3">{t('basic_data.institutions.doi_prefix')}</Typography>
              {customer.doiAgent?.prefix ? (
                <Typography sx={{ color: 'primary.light' }}>{customer.doiAgent.prefix}</Typography>
              ) : (
                '—'
              )}
            </div>
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
