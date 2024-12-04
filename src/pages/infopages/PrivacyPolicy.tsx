import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Trans, useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageContent } from '../../components/styled/Wrappers';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <StyledPageContent>
      <PageHeader>{t('privacy.privacy_statement')}</PageHeader>

      <Box sx={{ table: { mt: '0.5rem' }, ul: { marginTop: '0' } }}>
        <Typography variant="h2">{t('privacy.about.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.about.paragraph')}</Typography>

        <Typography variant="h2">{t('privacy.what_are_personal_data.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>
          <Trans t={t} i18nKey="privacy.what_are_personal_data.paragraph">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/§2">
              (i18n content: Personal Data Act Section 2)
            </a>
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a5">
              (i18n content: GDPR Article 5)
            </a>
          </Trans>
        </Typography>

        <Typography variant="h2">{t('privacy.service_in_brief.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.service_in_brief.paragraph0')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.service_in_brief.paragraph1')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.service_in_brief.paragraph2')}</Typography>

        <Typography variant="h2">{t('privacy.purpose.heading')}</Typography>
        <Typography>{t('privacy.purpose.paragraph')}</Typography>
        <TableContainer sx={{ mb: '2rem' }}>
          <Table size="small">
            <caption style={visuallyHidden}>{t('privacy.purpose.heading')}</caption>
            <TableHead>
              <TableRow>
                <TableCell>{t('privacy.purpose.table.header.col0')}</TableCell>
                <TableCell>{t('privacy.purpose.table.header.col1')}</TableCell>
                <TableCell>{t('privacy.purpose.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{t(`privacy.purpose.table.row${index}.col0` as any)}</TableCell>
                  <TableCell>{t(`privacy.purpose.table.row${index}.col1` as any)}</TableCell>
                  <TableCell>{t(`privacy.purpose.table.row${index}.col2` as any)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h2">{t('privacy.registered_personal_data.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>
          <Trans t={t} i18nKey="privacy.registered_personal_data.paragraph0">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a6">
              (i18n content: GDPR Article 6)
            </a>
          </Trans>
        </Typography>
        <Typography sx={{ mb: '1rem' }}>
          <Trans t={t} i18nKey="privacy.registered_personal_data.paragraph1">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a6">
              (i18n content: GDPR Article 6)
            </a>
          </Trans>
        </Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.registered_personal_data.paragraph2')}</Typography>
        <Typography sx={{ mb: '1rem' }}>
          <Trans t={t} i18nKey="privacy.registered_personal_data.paragraph3">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/§8">
              (i18n content: Personal Data Act Section 8)
            </a>
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a6">
              (i18n content: GDPR Article 8)
            </a>
          </Trans>
        </Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.registered_personal_data.paragraph4')}</Typography>

        <Typography variant="h3">{t('privacy.registered_personal_data.table.user_data.heading')}</Typography>
        <TableContainer sx={{ mb: '2rem' }}>
          <Table size="small">
            <caption style={visuallyHidden}>{t('privacy.registered_personal_data.table.user_data.heading')}</caption>
            <TableHead>
              <TableRow>
                <TableCell>{t('privacy.registered_personal_data.table.header.col0')}</TableCell>
                <TableCell>{t('privacy.registered_personal_data.table.header.col1')}</TableCell>
                <TableCell>{t('privacy.registered_personal_data.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{t(`privacy.registered_personal_data.table.user_data.row${index}.col0` as any)}</TableCell>
                  <TableCell>{t(`privacy.registered_personal_data.table.user_data.row${index}.col1` as any)}</TableCell>
                  <TableCell>{t(`privacy.registered_personal_data.table.user_data.row${index}.col2` as any)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h3">{t('privacy.registered_personal_data.table.techincal_user_data.heading')}</Typography>
        <TableContainer sx={{ mb: '2rem' }}>
          <Table size="small">
            <caption style={visuallyHidden}>
              {t('privacy.registered_personal_data.table.techincal_user_data.heading')}
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>{t('privacy.registered_personal_data.table.header.col0')}</TableCell>
                <TableCell>{t('privacy.registered_personal_data.table.header.col1')}</TableCell>
                <TableCell>{t('privacy.registered_personal_data.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(4)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {t(`privacy.registered_personal_data.table.techincal_user_data.row${index}.col0` as any)}
                  </TableCell>
                  <TableCell>
                    {t(`privacy.registered_personal_data.table.techincal_user_data.row${index}.col1` as any)}
                  </TableCell>
                  <TableCell>
                    {t(`privacy.registered_personal_data.table.techincal_user_data.row${index}.col2` as any)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h3">{t('privacy.registered_personal_data.table.other_user_data.heading')}</Typography>
        <TableContainer sx={{ mb: '2rem' }}>
          <Table size="small">
            <caption style={visuallyHidden}>
              {t('privacy.registered_personal_data.table.other_user_data.heading')}
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>{t('privacy.registered_personal_data.table.header.col0')}</TableCell>
                <TableCell>{t('privacy.registered_personal_data.table.header.col1')}</TableCell>
                <TableCell>{t('privacy.registered_personal_data.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(2)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {t(`privacy.registered_personal_data.table.other_user_data.row${index}.col0` as any)}
                  </TableCell>
                  <TableCell>
                    {t(`privacy.registered_personal_data.table.other_user_data.row${index}.col1` as any)}
                  </TableCell>
                  <TableCell>
                    {t(`privacy.registered_personal_data.table.other_user_data.row${index}.col2` as any)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography sx={{ mb: '1rem' }}>{t('privacy.registered_personal_data.paragraph5')}</Typography>
        <Typography>{t('privacy.registered_personal_data.paragraph6.intro')}</Typography>
        <ul>
          {[...Array(3)].map((_, index) => (
            <Typography key={index} component="li">
              {t(`privacy.registered_personal_data.paragraph6.bullet_point${index}` as any)}
            </Typography>
          ))}
        </ul>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.registered_personal_data.paragraph7')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.registered_personal_data.paragraph8')}</Typography>

        <Typography variant="h2">{t('privacy.automatic_case_processing.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.automatic_case_processing.paragraph0')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.automatic_case_processing.paragraph1')}</Typography>

        <Typography variant="h2">{t('privacy.disclosure_of_data.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.disclosure_of_data.paragraph0')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.disclosure_of_data.paragraph1')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.disclosure_of_data.paragraph2')}</Typography>
        <Typography>{t('privacy.disclosure_of_data.paragraph3.intro')}</Typography>
        <TableContainer sx={{ mb: '2rem' }}>
          <Table size="small">
            <caption style={visuallyHidden}>{t('privacy.disclosure_of_data.paragraph3.table.caption')}</caption>
            <TableHead>
              <TableRow>
                <TableCell>{t('privacy.disclosure_of_data.paragraph3.table.header.col0')}</TableCell>
                <TableCell>{t('privacy.disclosure_of_data.paragraph3.table.header.col1')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{t(`privacy.disclosure_of_data.paragraph3.table.row${index}.col0` as any)}</TableCell>
                  <TableCell>{t(`privacy.disclosure_of_data.paragraph3.table.row${index}.col1` as any)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.disclosure_of_data.paragraph4')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.disclosure_of_data.paragraph5')}</Typography>
        <Typography>{t('privacy.disclosure_of_data.paragraph6.intro')}</Typography>
        <TableContainer sx={{ mb: '2rem' }}>
          <Table size="small">
            <caption style={visuallyHidden}>{t('privacy.disclosure_of_data.paragraph6.table.caption')}</caption>
            <TableHead>
              <TableRow>
                <TableCell>{t('privacy.disclosure_of_data.paragraph6.table.header.col0')}</TableCell>
                <TableCell>{t('privacy.disclosure_of_data.paragraph6.table.header.col1')}</TableCell>
                <TableCell>{t('privacy.disclosure_of_data.paragraph6.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(6)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{t(`privacy.disclosure_of_data.paragraph6.table.row${index}.col0` as any)}</TableCell>
                  <TableCell>{t(`privacy.disclosure_of_data.paragraph6.table.row${index}.col1` as any)}</TableCell>
                  <TableCell>{t(`privacy.disclosure_of_data.paragraph6.table.row${index}.col2` as any)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h2">{t('privacy.security_for_personal_data.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.security_for_personal_data.paragraph0')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.security_for_personal_data.paragraph1')}</Typography>

        <Typography variant="h2">{t('privacy.your_rights.heading')}</Typography>
        <Typography variant="h3">{t('privacy.your_rights.section0.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section0.paragraph0')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section0.paragraph1')}</Typography>

        <Typography variant="h3">{t('privacy.your_rights.section1.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section1.paragraph0')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section1.paragraph1')}</Typography>

        <Typography variant="h3">{t('privacy.your_rights.section2.heading')}</Typography>
        <Typography>
          <Trans t={t} i18nKey="privacy.your_rights.section2.paragraph0.intro">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a18">
              (i18n content: GDPR Article 18)
            </a>
          </Trans>
        </Typography>
        <ul>
          <Typography component="li">{t('privacy.your_rights.section2.paragraph0.bullet_point0')}</Typography>
          <Typography component="li">{t('privacy.your_rights.section2.paragraph0.bullet_point1')}</Typography>
          <Typography component="li">{t('privacy.your_rights.section2.paragraph0.bullet_point2')}</Typography>
        </ul>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section2.paragraph1')}</Typography>

        <Typography variant="h3">{t('privacy.your_rights.section3.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section3.paragraph0')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section3.paragraph1')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section3.paragraph2')}</Typography>

        <Typography variant="h3">{t('privacy.your_rights.section4.heading')}</Typography>
        <Typography>
          <Trans t={t} i18nKey="privacy.your_rights.section4.paragraph0.intro">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a21">
              (i18n content: GDPR Article 21)
            </a>
          </Trans>
        </Typography>
        <ul>
          <Typography component="li">{t('privacy.your_rights.section4.paragraph0.bullet_point0')}</Typography>
          <Typography component="li">{t('privacy.your_rights.section4.paragraph0.bullet_point1')}</Typography>
          <Typography component="li">{t('privacy.your_rights.section4.paragraph0.bullet_point2')}</Typography>
        </ul>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section4.paragraph1')}</Typography>
        <Typography>{t('privacy.your_rights.section4.paragraph2.intro')}</Typography>
        <ul>
          <Typography component="li">{t('privacy.your_rights.section4.paragraph2.bullet_point0')}</Typography>
          <Typography component="li">{t('privacy.your_rights.section4.paragraph2.bullet_point1')}</Typography>
        </ul>

        <Typography variant="h3">{t('privacy.your_rights.section5.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section5.paragraph0')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.your_rights.section5.paragraph1')}</Typography>

        <Typography variant="h2">{t('privacy.contact.heading')}</Typography>
        <Typography variant="h3">{t('privacy.contact.section0.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.contact.section0.paragraph')}</Typography>
        <Typography variant="h3">{t('privacy.contact.section1.heading')}</Typography>
        <Typography sx={{ mb: '1rem' }}>{t('privacy.contact.section1.paragraph')}</Typography>

        <Typography>{t('privacy.contact.section2.intro')}</Typography>
        <Typography>
          <a target="_blank" rel="noreferrer" href="https://support.bibsys.no">
            https://support.bibsys.no
          </a>
        </Typography>
        <Typography>
          <Trans t={t} i18nKey="privacy.contact.section2.telephone">
            <a target="_blank" rel="noreferrer" href="tel:+4773984040">
              +47 73 98 40 40
            </a>
          </Trans>
        </Typography>
        <Typography>
          <Trans t={t} i18nKey="privacy.contact.section2.email">
            <a target="_blank" rel="noreferrer" href="mailto:kontakt@sikt.no">
              kontakt@sikt.no
            </a>
          </Trans>
        </Typography>
      </Box>
    </StyledPageContent>
  );
};

export default PrivacyPolicy;
