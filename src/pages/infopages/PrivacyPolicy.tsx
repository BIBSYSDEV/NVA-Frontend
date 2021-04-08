import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';

const StyledPrivacyContainer = styled.div`
  display: block;
  max-width: 90vw;

  table {
    margin-bottom: 1rem;
  }

  ul {
    margin-top: 0;
  }
`;

const PrivacyPolicy = () => {
  const { t } = useTranslation('privacy');

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('privacy_statement')}</PageHeader>

      <StyledPrivacyContainer>
        <Typography variant="h2">{t('about.heading')}</Typography>
        <Typography paragraph>{t('about.paragraph')}</Typography>

        <Typography variant="h2">{t('what_are_personal_data.heading')}</Typography>
        <Typography paragraph>
          <Trans t={t} i18nKey="what_are_personal_data.paragraph">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/§2">
              (i18n content: Personal Data Act Section 2)
            </a>
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a5">
              (i18n content: GDPR Article 5)
            </a>
          </Trans>
        </Typography>

        <Typography variant="h2">{t('service_in_brief.heading')}</Typography>
        <Typography paragraph>{t('service_in_brief.paragraph0')}</Typography>
        <Typography paragraph>{t('service_in_brief.paragraph1')}</Typography>
        <Typography paragraph>{t('service_in_brief.paragraph2')}</Typography>

        <Typography variant="h2">{t('purpose.heading')}</Typography>
        <Typography paragraph>{t('purpose.paragraph')}</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('purpose.table.header.col0')}</TableCell>
                <TableCell>{t('purpose.table.header.col1')}</TableCell>
                <TableCell>{t('purpose.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{t(`purpose.table.row${index}.col0`)}</TableCell>
                  <TableCell>{t(`purpose.table.row${index}.col1`)}</TableCell>
                  <TableCell>{t(`purpose.table.row${index}.col2`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h2">{t('registered_personal_data.heading')}</Typography>
        <Typography paragraph>
          <Trans t={t} i18nKey="registered_personal_data.paragraph0">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a6">
              (i18n content: GDPR Article 6)
            </a>
          </Trans>
        </Typography>
        <Typography paragraph>
          <Trans t={t} i18nKey="registered_personal_data.paragraph1">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a6">
              (i18n content: GDPR Article 6)
            </a>
          </Trans>
        </Typography>
        <Typography paragraph>{t('registered_personal_data.paragraph2')}</Typography>
        <Typography paragraph>
          <Trans t={t} i18nKey="registered_personal_data.paragraph3">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/§8">
              (i18n content: Personal Data Act Section 8)
            </a>
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a6">
              (i18n content: GDPR Article 8)
            </a>
          </Trans>
        </Typography>
        <Typography paragraph>{t('registered_personal_data.paragraph4')}</Typography>

        <Typography variant="h3">{t('registered_personal_data.table.user_data.heading')}</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('registered_personal_data.table.header.col0')}</TableCell>
                <TableCell>{t('registered_personal_data.table.header.col1')}</TableCell>
                <TableCell>{t('registered_personal_data.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{t(`registered_personal_data.table.user_data.row${index}.col0`)}</TableCell>
                  <TableCell>{t(`registered_personal_data.table.user_data.row${index}.col1`)}</TableCell>
                  <TableCell>{t(`registered_personal_data.table.user_data.row${index}.col2`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h3">{t('registered_personal_data.table.techincal_user_data.heading')}</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('registered_personal_data.table.header.col0')}</TableCell>
                <TableCell>{t('registered_personal_data.table.header.col1')}</TableCell>
                <TableCell>{t('registered_personal_data.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(4)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{t(`registered_personal_data.table.techincal_user_data.row${index}.col0`)}</TableCell>
                  <TableCell>{t(`registered_personal_data.table.techincal_user_data.row${index}.col1`)}</TableCell>
                  <TableCell>{t(`registered_personal_data.table.techincal_user_data.row${index}.col2`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h3">{t('registered_personal_data.table.other_user_data.heading')}</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('registered_personal_data.table.header.col0')}</TableCell>
                <TableCell>{t('registered_personal_data.table.header.col1')}</TableCell>
                <TableCell>{t('registered_personal_data.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(2)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{t(`registered_personal_data.table.other_user_data.row${index}.col0`)}</TableCell>
                  <TableCell>{t(`registered_personal_data.table.other_user_data.row${index}.col1`)}</TableCell>
                  <TableCell>{t(`registered_personal_data.table.other_user_data.row${index}.col2`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography paragraph>{t('registered_personal_data.paragraph5')}</Typography>
        <Typography>{t('registered_personal_data.paragraph6.intro')}</Typography>
        <ul>
          {[...Array(3)].map((_, index) => (
            <Typography key={index} component="li">
              {t(`registered_personal_data.paragraph6.bullet_point${index}`)}
            </Typography>
          ))}
        </ul>
        <Typography paragraph>{t('registered_personal_data.paragraph7')}</Typography>
        <Typography paragraph>{t('registered_personal_data.paragraph8')}</Typography>

        <Typography variant="h2">{t('automatic_case_processing.heading')}</Typography>
        <Typography paragraph>{t('automatic_case_processing.paragraph0')}</Typography>
        <Typography paragraph>{t('automatic_case_processing.paragraph1')}</Typography>

        <Typography variant="h2">{t('disclosure_of_data.heading')}</Typography>
        <Typography paragraph>{t('disclosure_of_data.paragraph0')}</Typography>
        <Typography paragraph>{t('disclosure_of_data.paragraph1')}</Typography>
        <Typography paragraph>{t('disclosure_of_data.paragraph2')}</Typography>
        <Typography>{t('disclosure_of_data.paragraph3.intro')}</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('disclosure_of_data.paragraph3.table.header.col0')}</TableCell>
                <TableCell>{t('disclosure_of_data.paragraph3.table.header.col1')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{t(`disclosure_of_data.paragraph3.table.row${index}.col0`)}</TableCell>
                  <TableCell>{t(`disclosure_of_data.paragraph3.table.row${index}.col1`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography paragraph>{t('disclosure_of_data.paragraph4')}</Typography>
        <Typography paragraph>{t('disclosure_of_data.paragraph5')}</Typography>
        <Typography>{t('disclosure_of_data.paragraph6.intro')}</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('disclosure_of_data.paragraph6.table.header.col0')}</TableCell>
                <TableCell>{t('disclosure_of_data.paragraph6.table.header.col1')}</TableCell>
                <TableCell>{t('disclosure_of_data.paragraph6.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(6)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{t(`disclosure_of_data.paragraph6.table.row${index}.col0`)}</TableCell>
                  <TableCell>{t(`disclosure_of_data.paragraph6.table.row${index}.col1`)}</TableCell>
                  <TableCell>{t(`disclosure_of_data.paragraph6.table.row${index}.col2`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography variant="h2">{t('security_for_personal_data.heading')}</Typography>
          <Typography paragraph>{t('security_for_personal_data.paragraph0')}</Typography>
          <Typography paragraph>{t('security_for_personal_data.paragraph1')}</Typography>

          <Typography variant="h2">{t('your_rights.heading')}</Typography>
          <Typography variant="h3">{t('your_rights.section0.heading')}</Typography>
          <Typography paragraph>{t('your_rights.section0.paragraph0')}</Typography>
          <Typography paragraph>{t('your_rights.section0.paragraph1')}</Typography>

          <Typography variant="h3">{t('your_rights.section1.heading')}</Typography>
          <Typography paragraph>{t('your_rights.section1.paragraph0')}</Typography>
          <Typography paragraph>{t('your_rights.section1.paragraph1')}</Typography>

          <Typography variant="h3">{t('your_rights.section2.heading')}</Typography>
          <Typography>
            <Trans t={t} i18nKey="your_rights.section2.paragraph0.intro">
              <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a18">
                (i18n content: GDPR Article 18)
              </a>
            </Trans>
          </Typography>
          <ul>
            <Typography component="li">{t('your_rights.section2.paragraph0.bullet_point0')}</Typography>
            <Typography component="li">{t('your_rights.section2.paragraph0.bullet_point1')}</Typography>
            <Typography component="li">{t('your_rights.section2.paragraph0.bullet_point2')}</Typography>
          </ul>
          <Typography paragraph>{t('your_rights.section2.paragraph1')}</Typography>

          <Typography variant="h3">{t('your_rights.section3.heading')}</Typography>
          <Typography paragraph>{t('your_rights.section3.paragraph0')}</Typography>
          <Typography paragraph>{t('your_rights.section3.paragraph1')}</Typography>
          <Typography paragraph>{t('your_rights.section3.paragraph2')}</Typography>

          <Typography variant="h3">{t('your_rights.section4.heading')}</Typography>
          <Typography>
            <Trans t={t} i18nKey="your_rights.section4.paragraph0.intro">
              <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a21">
                (i18n content: GDPR Article 21)
              </a>
            </Trans>
          </Typography>
          <ul>
            <Typography component="li">{t('your_rights.section4.paragraph0.bullet_point0')}</Typography>
            <Typography component="li">{t('your_rights.section4.paragraph0.bullet_point1')}</Typography>
            <Typography component="li">{t('your_rights.section4.paragraph0.bullet_point2')}</Typography>
          </ul>
          <Typography paragraph>{t('your_rights.section4.paragraph1')}</Typography>
          <Typography>{t('your_rights.section4.paragraph2.intro')}</Typography>
          <ul>
            <Typography component="li">{t('your_rights.section4.paragraph2.bullet_point0')}</Typography>
            <Typography component="li">{t('your_rights.section4.paragraph2.bullet_point1')}</Typography>
          </ul>

          <Typography variant="h3">{t('your_rights.section5.heading')}</Typography>
          <Typography paragraph>{t('your_rights.section5.paragraph0')}</Typography>
          <Typography paragraph>{t('your_rights.section5.paragraph1')}</Typography>

          <Typography variant="h2">{t('contact.heading')}</Typography>
          <Typography variant="h3">{t('contact.section0.heading')}</Typography>
          <Typography paragraph>{t('contact.section0.paragraph')}</Typography>
          <Typography variant="h3">{t('contact.section1.heading')}</Typography>
          <Typography paragraph>{t('contact.section1.paragraph')}</Typography>

          <Typography>{t('contact.section2.intro')}</Typography>
          <Typography>
            <a target="_blank" rel="noreferrer" href="https://support.bibsys.no">
              https://support.bibsys.no
            </a>
          </Typography>
          <Typography>
            <Trans t={t} i18nKey="contact.section2.telephone">
              <a target="_blank" rel="noreferrer" href="tel:+4773984040">
                +47 73 98 40 40
              </a>
            </Trans>
          </Typography>
          <Typography>
            <Trans t={t} i18nKey="contact.section2.email">
              <a target="_blank" rel="noreferrer" href="mailto:support@unit.no">
                support@unit.no
              </a>
            </Trans>
          </Typography>
        </TableContainer>
      </StyledPrivacyContainer>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default PrivacyPolicy;
