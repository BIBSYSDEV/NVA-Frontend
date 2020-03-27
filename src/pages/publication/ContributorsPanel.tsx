import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import TabPanel from '../../components/TabPanel/TabPanel';
import SortableTable from './contributors_tab/components/SortableTable';
import { FormikProps, useFormikContext, FieldArray } from 'formik';
import { FormikPublication } from '../../types/publication.types';
import { ContributorFieldNames } from '../../types/publicationFieldNames';
import { getAllContributorFields } from '../../utils/formik-helpers';

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: () => void;
}

const ContributorsPanel: FC<ContributorsPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation('publication');
  const {
    setFieldTouched,
    values: {
      entityDescription: { contributors },
    },
  }: FormikProps<FormikPublication> = useFormikContext();

  const contributorsLengthRef = useRef(contributors.length);
  useEffect(() => {
    contributorsLengthRef.current = contributors.length;
  }, [contributors.length]);

  // Set all fields to touched on unmount
  useEffect(() => {
    return () => {
      // Use contributorsLengthRef to avoid trigging this useEffect on every values update
      const fieldNames = getAllContributorFields(contributorsLengthRef.current);
      fieldNames.forEach((fieldName) => setFieldTouched(fieldName));
    };
  }, [setFieldTouched]);

  return (
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={savePublication}>
      <Card>
        <Heading>{t('contributors.authors')}</Heading>
        <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
          {({ push, remove, swap }) => (
            <SortableTable listOfContributors={contributors} push={push} remove={remove} swap={swap} />
          )}
        </FieldArray>
      </Card>
    </TabPanel>
  );
};

export default ContributorsPanel;
