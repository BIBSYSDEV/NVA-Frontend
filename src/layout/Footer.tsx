import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Divider, Link as MuiLink, Typography, styled } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { dataTestId } from '../utils/dataTestIds';
import { UrlPathTemplate } from '../utils/urlPaths';
import { LanguageSelector } from './header/LanguageSelector';

const StyledArrowLinkContainer = styled(Box)({
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '0.3rem',
});

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        padding: '1rem',
        bgcolor: 'info.light',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
        gap: '3rem',
        color: 'primary.main',
      }}>
      <div>
        <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
          <Typography color="primary" sx={{ fontWeight: 'bold' }}>
            {t('footer.about_nva')}
          </Typography>

          <MuiLink
            sx={{ color: 'primary.main', display: 'flex', gap: '0.5rem' }}
            data-testid={dataTestId.footer.aboutLink}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva'}>
            {t('common.read_more')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
        </Box>

        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        <Typography color="primary">{t('footer.about_nva_text')}</Typography>

        <Typography
          color="primary"
          sx={{
            fontWeight: 'bold',
            gap: '0.5rem',
            mt: '2rem',
          }}>
          {t('footer.language_selector')}
        </Typography>

        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        <LanguageSelector />
      </div>

      <div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}>
          <Typography color="primary" sx={{ fontWeight: 'bold' }}>
            {t('footer.become_customer')}
          </Typography>

          <MuiLink
            sx={{
              color: 'primary.main',
              display: 'flex',
              gap: '0.5rem',
            }}
            data-testid={dataTestId.footer.becomeCustomer}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva#Tjenestebetingelser'}>
            {t('common.read_more')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
        </Box>

        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        <Typography color="primary">{t('footer.about_sikt_text')}</Typography>

        <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', mt: '2rem' }}>
          <Typography color="primary" sx={{ fontWeight: 'bold' }}>
            {t('footer.about_sikt')}
          </Typography>

          <MuiLink
            sx={{ color: 'primary.main', display: 'flex', gap: '0.5rem' }}
            data-testid={dataTestId.footer.aboutSikt}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/'}>
            {t('common.read_more')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
        </Box>

        <Divider sx={{ bgcolor: 'primary.main', mb: '0.5rem' }} />

        <Typography color="primary">{t('about.footer_text')}</Typography>
      </div>

      <div>
        <MuiLink
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            display: 'flex',
            gap: '0.5rem',
            mb: '1rem',
          }}
          data-testid={dataTestId.footer.helpPage}
          target="_blank"
          rel="noopener noreferrer"
          href={'https://sikt.no/tjenester/nasjonalt-vitenarkiv-nva/hjelpeside-nva'}>
          {t('footer.help_page')}
          <LaunchIcon fontSize="small" />
        </MuiLink>

        <MuiLink
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            display: 'flex',
            gap: '0.5rem',
            mb: '1rem',
          }}
          data-testid={dataTestId.footer.systemStatusLink}
          target="_blank"
          rel="noopener noreferrer"
          href={'https://sikt.no/driftsmeldinger'}>
          {t('footer.system_status_link')}
          <LaunchIcon fontSize="small" />
        </MuiLink>

        <Divider sx={{ bgcolor: 'primary.main', mb: '0.8rem' }} />

        <StyledArrowLinkContainer>
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
        </StyledArrowLinkContainer>

        <StyledArrowLinkContainer>
          <ArrowRightAltIcon />
          <MuiLink
            data-testid={dataTestId.footer.privacyLink}
            color={'primary.main'}
            component={Link}
            to={UrlPathTemplate.PrivacyPolicy}>
            {t('privacy.privacy_statement')}
          </MuiLink>
        </StyledArrowLinkContainer>

        <StyledArrowLinkContainer>
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
        </StyledArrowLinkContainer>

        <StyledArrowLinkContainer>
          <ArrowRightAltIcon />
          <MuiLink
            sx={{
              color: 'primary.main',
              display: 'flex',
              gap: '0.5rem',
            }}
            target="_blank"
            rel="noopener noreferrer"
            href={'https://sikt.no/om-sikt/kontakt-oss?service=e588691c-22eb-49c3-ac50-755f5513a3f5#skjema'}>
            {t('about.copyright_inquiries')}
            <LaunchIcon fontSize="small" />
          </MuiLink>
        </StyledArrowLinkContainer>

        <StyledArrowLinkContainer>
          <ArrowRightAltIcon />

          <Typography color="primary">
            <Trans t={t} i18nKey="footer.technical_support_link">
              <MuiLink
                color="primary"
                href={'mailto:kontakt@sikt.no'}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={dataTestId.footer.technicalSupportLink}>
                (i18n content: support email)
              </MuiLink>
            </Trans>
          </Typography>
        </StyledArrowLinkContainer>
      </div>
    </Box>
  );
};
