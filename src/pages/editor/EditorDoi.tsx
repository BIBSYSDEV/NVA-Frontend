import { CircularProgress, Typography, Link as MuiLink, Box } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { DoiAgent } from '../../types/customerInstitution.types';
import { useFetch } from '../../utils/hooks/useFetch';

export const EditorDoi = () => {
  const { t } = useTranslation();
  const { customer } = useSelector((store: RootState) => store);

  // TODO: use values from customer instead of extra call to /doiagent
  const [doiAgent, isLoadingDoiAgent] = useFetch<DoiAgent>({
    url: customer?.doiAgent.id ?? '',
    withAuthentication: true,
  });

  const hasConfiguredDoi = doiAgent?.prefix;

  return (
    <>
      <Typography id="doi-label" variant="h2" sx={{ mb: '2rem' }}>
        {t('common.doi_long')}
      </Typography>
      {isLoadingDoiAgent ? (
        <CircularProgress aria-labelledby="doi-label" />
      ) : (
        <>
          {!hasConfiguredDoi ? (
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
              background: '#d9d9d9',
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
              <Typography variant="h3">{t('basic_data.institutions.doi_name')}</Typography>
              {doiAgent?.username ? <Typography sx={{ color: 'primary.light' }}>{doiAgent.username}</Typography> : '-'}
            </div>
            <div>
              <Typography variant="h3">{t('basic_data.institutions.doi_prefix')}</Typography>
              {doiAgent?.prefix ? <Typography sx={{ color: 'primary.light' }}>{doiAgent.prefix}</Typography> : '-'}
            </div>
          </Box>

          <Box component="ul" sx={{ pl: '1rem' }}>
            {t(`editor.doi.doi_information_bullet_points`)
              .split('|')
              .map((item) => (
                <li>{item}</li>
              ))}
          </Box>
          <Box component="ul" sx={{ pl: '1rem' }}>
            {t(`editor.doi.doi_information_bullet_points_2`)
              .split('|')
              .map((item) => (
                <li>{item}</li>
              ))}
          </Box>
        </>
      )}
    </>
  );
};
