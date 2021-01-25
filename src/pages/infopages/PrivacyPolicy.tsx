import React from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';

import { PageHeader } from '../../components/PageHeader';

const StyledPrivacyContainer = styled.div`
  display: block;
`;

const PrivacyPolicy = () => {
  const { t } = useTranslation('privacy');

  return (
    <>
      <PageHeader>{t('privacy_statement')}</PageHeader>

      <StyledPrivacyContainer>
        <Typography variant="h2">{t('about.heading')}</Typography>
        <Typography>{t('about.description')}</Typography>

        <Typography variant="h2">{t('what_are_personal_data.heading')}</Typography>
        <Typography>
          <Trans t={t} i18nKey="what_are_personal_data.description">
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/§2">
              (i18n content: Personal Data Act Section 2)
            </a>
            <a target="_blank" rel="noreferrer" href="https://lovdata.no/lov/2018-06-15-38/gdpr/a5">
              (i18n content: GDPR Article 5)
            </a>
          </Trans>
        </Typography>

        <Typography variant="h2">{t('service_in_brief.heading')}</Typography>
        <Typography>{t('service_in_brief.description0')}</Typography>
        <Typography>{t('service_in_brief.description1')}</Typography>
        <Typography>{t('service_in_brief.description2')}</Typography>

        <Typography variant="h2">{t('purpose.heading')}</Typography>
        <Typography>{t('purpose.description')}</Typography>
        <Table>
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
      </StyledPrivacyContainer>
    </>
  );
};

export default PrivacyPolicy;
