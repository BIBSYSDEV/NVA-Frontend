import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Divider, Link as MuiLink, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { dataTestId } from '../utils/dataTestIds';
import { UrlPathTemplate } from '../utils/urlPaths';

import { LanguageSelector } from './header/LanguageSelector';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        padding: '1rem',
        bgcolor: 'info.light',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' },
        columnGap: '3rem',
        color: 'primary.main',
      }}>
      {/* Box 1 */}

      <Box>
        {/* Om Nasjonalt Vitenarkiv (NVA) */}
        <Box sx={{ display: 'flex', gap: '0.5rem', color: 'primary.main' }}>
          <Typography
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}>
            {t('footer.about_nva')}
          </Typography>

          <MuiLink
            sx={{
              justifySelf: { xs: 'center', lg: 'start' },
              gridRow: { xs: 3, lg: 1 },

              marginLeft: 'auto',
              color: 'primary.main',
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

        <Typography
          sx={{
            color: 'primary.main',
            gridColumn: { xs: 1, lg: 1 },
            justifySelf: 'center',
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
            mt: '2rem',
          }}>
          <Typography
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}>
            {t('footer.language_selector')}
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        <LanguageSelector />
      </Box>

      {/* Box 2 */}

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Hvordan bli kunde */}
        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'start' },
            gap: '0.5rem',
          }}>
          <Typography
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}>
            {t('footer.become_customer')}
          </Typography>

          <MuiLink
            sx={{
              justifySelf: { xs: 'center', lg: 'start' },
              gridRow: { xs: 3, lg: 1 },
              marginLeft: 'auto',
              color: 'primary.main',
            }}
            data-testid={dataTestId.footer.becomeCustomer}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva'}>
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
          <Typography
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
            }}>
            {t('footer.about_sikt')}
          </Typography>

          <MuiLink
            sx={{
              justifySelf: { xs: 'center', lg: 'start' },
              gridRow: { xs: 3, lg: 1 },
              marginLeft: 'auto',
              color: 'primary.main',
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
          }}>
          {t('about.footer_text')}
        </Typography>
      </Box>

      {/* Box 3 */}

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Hjelpeside */}
        <Box sx={{ display: 'flex', gap: '0.5rem', mb: '0.4rem', fontWeight: 'bold' }}>
          <MuiLink
            data-testid={dataTestId.footer.helpPage}
            color={'primary.main'}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpeside-nva'}>
            {t('footer.help_page')}
          </MuiLink>
          <LaunchIcon fontSize="small" />
        </Box>

        {/* Driftsmeldinger */}
        <Box sx={{ display: 'flex', gap: '0.5rem', mb: '1rem', fontWeight: 'bold' }}>
          <MuiLink
            data-testid={dataTestId.footer.systemStatusLink}
            color={'primary.main'}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/driftsmeldinger'}>
            {t('footer.system_status_link')}
          </MuiLink>
          <LaunchIcon fontSize="small" />
        </Box>

        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        {/* --------------------------------------------------------------------------------------- */}

        {/* Nyhetsbrev */}
        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'center', lg: 'start' },
            gap: '0.5rem',
            gridColumn: { xs: 1, lg: 3 },
          }}>
          <ArrowRightAltIcon />
          <MuiLink
            data-testid={dataTestId.footer.newsLink}
            color={'primary.main'}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://pub.dialogapi.no/s/MjI2NDQ6MWVmZmQxOTktMGVkZi00YjZhLWE2ZjQtNzNmZWU2NjI2ZmFi'}>
            {t('footer.news_link')}
          </MuiLink>
          <LaunchIcon fontSize="small" />
        </Box>

        {/* Personvern og informasjonskapsler */}
        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'center', lg: 'start' },
            gap: '0.5rem',
            gridColumn: { xs: 1, lg: 3 },
          }}>
          <ArrowRightAltIcon />
          <MuiLink
            data-testid={dataTestId.footer.privacyLink}
            color={'primary.main'}
            component={Link}
            to={UrlPathTemplate.PrivacyPolicy}>
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
            sx={{
              color: 'primary.main',
            }}
            data-testid={dataTestId.footer.availabilityStatement}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://uustatus.no/nb/erklaringer/publisert/bffb4b1d-25eb-4fe0-bac7-2f0b4a8e0fd9'}>
            {t('about.availability_statement')}
          </MuiLink>
          <LaunchIcon fontSize="small" />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'center', lg: 'start' },
            gap: '0.5rem',
            gridColumn: { xs: 1, lg: 3 },
          }}>
          <ArrowRightAltIcon />

          <Typography
            paragraph
            sx={{
              color: 'primary.main',
            }}>
            <Trans t={t} i18nKey="footer.technical_support_link">
              <MuiLink
                sx={{
                  color: 'primary.main',
                }}
                href={'mailto:kontakt@sikt.no'}
                target="_blank"
                rel="noopener noreferrer">
                data-testid={dataTestId.footer.technicalSupportLink}
                (i18n content: support email)
              </MuiLink>
            </Trans>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
