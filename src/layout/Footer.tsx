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
      <Box>
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
              display: 'flex',
              gap: '0.5rem',
            }}
            data-testid={dataTestId.footer.aboutLink}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva'}>
            {t('footer.read_more')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
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

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
              display: 'flex',
              gap: '0.5rem',
            }}
            data-testid={dataTestId.footer.becomeCustomer}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva#Tjenestebetingelser'}>
            {t('footer.read_more')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
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
              display: 'flex',
              gap: '0.5rem',
            }}
            data-testid={dataTestId.footer.aboutSikt}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/'}>
            {t('footer.read_more')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
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

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', gap: '0.5rem', mb: '0.5rem', fontWeight: 'bold' }}>
          <MuiLink
            sx={{
              color: 'primary.main',
              display: 'flex',
              gap: '0.5rem',
            }}
            data-testid={dataTestId.footer.helpPage}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpeside-nva'}>
            {t('footer.help_page')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
        </Box>

        <Box sx={{ display: 'flex', gap: '0.5rem', mb: '1rem', fontWeight: 'bold' }}>
          <MuiLink
            sx={{
              color: 'primary.main',
              display: 'flex',
              gap: '0.5rem',
            }}
            data-testid={dataTestId.footer.systemStatusLink}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/driftsmeldinger'}>
            {t('footer.system_status_link')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
        </Box>

        <Divider sx={{ bgcolor: 'primary.main', mb: '0.8rem' }} />

        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'center', lg: 'start' },
            gap: '0.5rem',
            gridColumn: { xs: 1, lg: 3 },
            mb: '0.3rem',
          }}>
          <ArrowRightAltIcon />
          <MuiLink
            sx={{
              color: 'primary.main',
              display: 'flex',
              gap: '0.5rem',
            }}
            data-testid={dataTestId.footer.newsLink}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://pub.dialogapi.no/s/MjI2NDQ6MWVmZmQxOTktMGVkZi00YjZhLWE2ZjQtNzNmZWU2NjI2ZmFi'}>
            {t('footer.news_link')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'center', lg: 'start' },
            gap: '0.5rem',
            gridColumn: { xs: 1, lg: 3 },
            mb: '0.3rem',
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

        <Box
          sx={{
            display: 'flex',
            justifySelf: { xs: 'center', lg: 'start' },
            gap: '0.5rem',
            gridColumn: { xs: 1, lg: 3 },
            mb: '0.3rem',
          }}>
          <ArrowRightAltIcon />
          <MuiLink
            sx={{
              color: 'primary.main',
              display: 'flex',
              gap: '0.5rem',
            }}
            data-testid={dataTestId.footer.availabilityStatement}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://uustatus.no/nb/erklaringer/publisert/bffb4b1d-25eb-4fe0-bac7-2f0b4a8e0fd9'}>
            {t('about.availability_statement')}
            <LaunchIcon fontSize="small" />
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
