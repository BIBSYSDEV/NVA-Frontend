import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '../../components/Box';
import TabPanel from '../../components/TabPanel/TabPanel';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../types/publication.types';
import { Button } from '@material-ui/core';
import LabelTextLine from '../../components/LabelTextLine';

const SubmissionPanel: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  console.log(values);

  values.title.nb = 'jfdkls fksdjf sdklj fsdkfj sdkfj sdlkfj sdklf jsdl';
  values.abstract =
    'jgfkldjgldfkjgkldfj gkldf gdfkljg dfkljg dfklgj dfklg lkdfj' +
    ' gkldj fgkljd fgklj dfgkl gfd gkldf gdfkljg dfkljg dfklgj dfklg' +
    ' lkdfj gkldj fgkljd fgklj dfgkl gfd gkldf gdfkljg dfkljg dfklgj ' +
    'dfklg lkdfj gkldj fgkljd fgklj dfgkl gfd gkldf gdfkljg dfkljg dfklgj' +
    ' dfklg lkdfj gkldj fgkljd fgklj dfgkl gfd gkldf gdfkljg dfkljg dfklgj dfklg ' +
    'lkdfj gkldj fgkljd fgklj dfgkl gfd gkldf gdfkljg dfkljg' +
    ' dfklgj dfklg lkdfj gkldj fgkljd fgklj dfgkl gfd';

  return (
    <TabPanel ariaLabel="submission">
      <Box>
        <h1>{t('heading.summary')}</h1>

        <h2>{t('heading.description')}</h2>

        <LabelTextLine label={t('common:title')} text={values.title.nb}></LabelTextLine>
        <LabelTextLine label={t('description.abstract')} text={values.abstract}></LabelTextLine>

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
