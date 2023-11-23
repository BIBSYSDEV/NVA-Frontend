import { Link as MuiLink, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { dataTestId } from '../utils/dataTestIds';
import { UrlPathTemplate } from '../utils/urlPaths';

{
  /*import { LanguageSelector } from './header/LanguageSelector';*/
}

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        padding: '1rem',
        bgcolor: 'info.light',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '3fr 3fr 3fr' },
        columnGap: '3rem',
      }}>
      {/* ---------------------------- Box 1 ---------------------------------- */}

      <Box>
        {/* Om Nasjonalt Vitenarkiv (NVA) */}
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <ArrowRightAltIcon />

          <Typography
            sx={{
              fontWeight: 'bold',
            }}>
            {t('footer.about_nva')}
          </Typography>

          <MuiLink
            sx={{
              justifySelf: { xs: 'center', lg: 'start' },
              gridRow: { xs: 3, lg: 1 },

              marginLeft: 'auto',
            }}
            data-testid={dataTestId.footer.aboutLink}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva'}>
            {t('footer.read_more')}
          </MuiLink>
          <LaunchIcon fontSize="small" />
        </Box>

        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        {/* Tekst: NVA er en nasjonal fellestjeneste ... */}
        <Typography
          sx={{
            color: 'primary.main',
            gridColumn: { xs: 1, lg: 1 },
            justifySelf: 'center',
            ml: '2rem',
          }}>
          {t('footer.about_nva_text')}
        </Typography>

        {/* Språkvalg */}

        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'start' },
            gap: '0.5rem',
            gridColumn: { xs: 1, lg: 2 },
          }}>
          <ArrowRightAltIcon />

          <Typography
            sx={{
              fontWeight: 'bold',
            }}>
            {t('footer.language_selector')}
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        {/*<LanguageSelector /> */}
      </Box>

      {/* ---------------------------- Box 2 ---------------------------------- */}

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Hvordan bli kunde */}
        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'start' },
            gap: '0.5rem',
          }}>
          <ArrowRightAltIcon />

          <Typography
            sx={{
              fontWeight: 'bold',
            }}>
            {t('footer.become_customer')}
          </Typography>

          <MuiLink
            sx={{
              justifySelf: { xs: 'center', lg: 'start' },
              gridRow: { xs: 3, lg: 1 },
            }}
            data-testid={dataTestId.footer.becomeCustomer}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpesenter-nva'}>
            {t('footer.read_more')}
          </MuiLink>

          <LaunchIcon fontSize="small" />
        </Box>

        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        {/* Tekst: Sikt er leverandør til norsk kunnskapssektor .... */}

        <Typography
          sx={{
            color: 'primary.main',
            gridColumn: { xs: 1, lg: 2 },
            justifySelf: 'start',
            ml: '2rem',
          }}>
          {t('footer.about_sikt_text')}
        </Typography>

        {/* Om Sikt */}

        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'start' },
            gap: '0.5rem',
            mt: '2rem',
          }}>
          <ArrowRightAltIcon />

          <Typography
            sx={{
              fontWeight: 'bold',
            }}>
            {t('footer.about_sikt')}
          </Typography>

          <MuiLink
            sx={{
              justifySelf: { xs: 'center', lg: 'start' },
              gridRow: { xs: 3, lg: 1 },
            }}
            data-testid={dataTestId.footer.aboutSikt}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/'}>
            {t('footer.read_more')}
          </MuiLink>
          <LaunchIcon fontSize="small" />
        </Box>
        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        <Typography
          sx={{
            color: 'primary.main',
            gridColumn: { xs: 1, lg: 2 },
            justifySelf: 'start',
            ml: '2rem',
          }}>
          {t('about.footer_text')}
        </Typography>
      </Box>

      {/* ---------------------------- Box 3 ---------------------------------- */}

      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 'fit-content' }}>
        {/* Hjelpesenter */}
        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'start' },
            gap: '0.5rem',
          }}>
          <ArrowRightAltIcon />

          <Typography
            sx={{
              fontWeight: 'bold',
            }}>
            {t('footer.help_center')}
          </Typography>

          <MuiLink
            sx={{
              justifySelf: { xs: 'center', lg: 'start' },
              gridRow: { xs: 3, lg: 1 },
            }}
            data-testid={dataTestId.footer.becomeCustomer}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpesenter-nva'}>
            {t('footer.read_more')}
          </MuiLink>

          <LaunchIcon fontSize="small" />
        </Box>

        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        {/* Aktuelt */}

        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <ArrowCircleRightIcon />
          <MuiLink
            data-testid={dataTestId.footer.newsLink}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpesenter-nva'}>
            {t('footer.news_link')}
          </MuiLink>
          <LaunchIcon fontSize="small" />
        </Box>

        {/* Driftsmeldinger */}

        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <ArrowCircleRightIcon />
          <MuiLink
            data-testid={dataTestId.footer.systemStatusLink}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/driftsmeldinger'}>
            {t('footer.system_status_link')}
          </MuiLink>
          <LaunchIcon fontSize="small" />
        </Box>

        <Divider sx={{ bgcolor: 'primary.main', mt: '0.5rem', mb: '1rem' }} />

        <Box>
          {/* Personvern og informasjonskapsler */}

          <Box
            sx={{
              display: 'flex',
              justifySelf: { xs: 'center', lg: 'start' },
              gap: '0.5rem',
              gridColumn: { xs: 1, lg: 3 },
            }}>
            <ArrowRightAltIcon />
            <MuiLink data-testid={dataTestId.footer.privacyLink} component={Link} to={UrlPathTemplate.PrivacyPolicy}>
              {t('privacy.privacy_statement')}
            </MuiLink>
          </Box>

          {/* Tilgjengelighetserklæring */}

          <Box
            sx={{
              display: 'flex',
              justifySelf: { xs: 'center', lg: 'start' },
              gap: '0.5rem',
              gridColumn: { xs: 1, lg: 3 },
            }}>
            <ArrowRightAltIcon />
            <MuiLink
              data-testid={dataTestId.footer.availabilityStatement}
              target="_blank"
              rel="noopener noreferrer"
              href={'https://uustatus.no/nb/erklaringer/publisert/bffb4b1d-25eb-4fe0-bac7-2f0b4a8e0fd9'}>
              {t('about.availability_statement')}
            </MuiLink>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifySelf: { xs: 'center', lg: 'start' },
              gap: '0.5rem',
              gridColumn: { xs: 1, lg: 3 },
            }}>
            <ArrowRightAltIcon />

            <Typography paragraph>
              <Trans t={t} i18nKey="footer.technical_support_link">
                <MuiLink href={'mailto:kontakt@sikt.no'} target="_blank" rel="noopener noreferrer">
                  data-testid={dataTestId.footer.technicalSupportLink}
                  (i18n content: support email)
                </MuiLink>
              </Trans>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
