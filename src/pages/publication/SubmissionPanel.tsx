import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../types/publication.types';
import { Button } from '@material-ui/core';
import LabelContentLine from '../../components/LabelContentLine';
import styled from 'styled-components';

const StyledContentText = styled.div`
  margin-bottom: 0.3rem;
  font-weight: bold;
`;

const SubmissionPanel: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <TabPanel ariaLabel="submission">
      <Box>
        <h1>{t('heading.summary')}</h1>

        <StyledContentText>{values.title.nb}</StyledContentText>

        <h2>{t('heading.description')}</h2>

        <LabelContentLine label={t('description.abstract')}>{values.abstract}</LabelContentLine>
        <LabelContentLine label={t('description:description')}>{values.description}</LabelContentLine>
        <LabelContentLine label={t('description.npi_disciplines')}>
          {values.npiDiscipline.mainDiscipline}
          {values.npiDiscipline.title && `- ${values.npiDiscipline.title}`}
        </LabelContentLine>
        <LabelContentLine label={t('description.tags')}>{`${values.tags.join(', ')}`}</LabelContentLine>
        <LabelContentLine label={t('common:language')}>{t(`languages:${values.language}`)}</LabelContentLine>
        <LabelContentLine label={t('description.date_published')}>
          {values.publicationDate.year}
          {values.publicationDate.month && `-${values.publicationDate.month}`}
          {values.publicationDate.day && `-${values.publicationDate.day}`}
        </LabelContentLine>
        <LabelContentLine label={t('description.project_association')}>
          {values.projects.map(project => {
            return <StyledContentText>{project.titles?.[0]?.title}</StyledContentText>;
          })}
        </LabelContentLine>

        <h2>{t('heading.references')}</h2>

        <h2>{t('heading.contributors')}</h2>

        <h2>{t('heading.files_and_license')}</h2>
      </Box>

      <Button color="primary" variant="contained">
        {t('Publish')}
      </Button>
      {/*<Button variant="contained">{t('Save')}</Button>*/}

      {/*<div>{t('delete_registration')}</div>*/}
    </TabPanel>
  );
};

export default SubmissionPanel;
