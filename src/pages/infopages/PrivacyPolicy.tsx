import React from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { PageHeader } from '../../components/PageHeader';

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
    <>
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
                <TableCell>{t('common:description')}</TableCell>
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
                <TableCell>{t('common:description')}</TableCell>
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
                <TableCell>{t('common:description')}</TableCell>
                <TableCell>{t('registered_personal_data.table.header.col2')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(3)].map((_, index) => (
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
                <TableCell>{t('common:description')}</TableCell>
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
        </TableContainer>
      </StyledPrivacyContainer>
    </>
  );
};

export default PrivacyPolicy;
