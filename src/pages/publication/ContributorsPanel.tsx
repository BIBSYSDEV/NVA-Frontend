import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText } from '@material-ui/core';
import { FormikProps, useFormikContext, FieldArray, ErrorMessage, FieldArrayRenderProps } from 'formik';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import TabPanel from '../../components/TabPanel/TabPanel';
import SortableTable from './contributors_tab/components/SortableTable';
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

  const contributorsRef = useRef(contributors);
  useEffect(() => {
    contributorsRef.current = contributors;
  }, [contributors]);

  // Set all fields to touched on unmount
  useEffect(
    () => () => {
      // Use contributorsRef to avoid trigging this useEffect on every values update
      const fieldNames = getAllContributorFields(contributorsRef.current);
      fieldNames.forEach((fieldName) => setFieldTouched(fieldName));
    },
    [setFieldTouched]
  );

  return (
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={savePublication}>
      <Card>
        <Heading>{t('contributors.authors')}</Heading>
        <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
          {({ push, remove, swap, name }: FieldArrayRenderProps) => (
            <>
              <SortableTable listOfContributors={contributors} push={push} remove={remove} swap={swap} />
              {contributors.length === 0 && (
                <FormHelperText error>
                  <ErrorMessage name={name} />
                </FormHelperText>
              )}
            </>
          )}
        </FieldArray>
      </Card>
    </TabPanel>
  );
};

export default ContributorsPanel;
