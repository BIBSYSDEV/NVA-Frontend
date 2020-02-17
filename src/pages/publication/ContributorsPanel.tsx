import React, { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import StyledCard from '../../components/Card';
import Heading from '../../components/Heading';
import TabPanel from '../../components/TabPanel/TabPanel';
import SortableTable from './contributors_tab/components/SortableTable';
import { FormikProps, useFormikContext, FieldArray, getIn } from 'formik';
import { Publication } from '../../types/publication.types';

export enum ContributorFieldNames {
  CONTRIBUTORS = 'contributors',
  TYPE = 'type',
  NAME = 'name',
  CORRESPONDING = 'corresponding',
  EMAIL = 'email',
  ORCID = 'orcid',
  SYSTEM_CONTROL_NUMBER = 'systemControlNumber',
  INSTITUTIONS = 'institutions',
  INSTITUTION_ID = 'institution.id',
  INSTITUTION_NAME = 'institution.name',
}

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: () => void;
}

const ContributorsPanel: FC<ContributorsPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation('publication');
  const { setFieldTouched, values }: FormikProps<Publication> = useFormikContext();

  // Validation messages won't show on fields that are not touched
  const setAllFieldsTouched = useCallback(() => {
    Object.values(ContributorFieldNames).forEach(fieldName => setFieldTouched(fieldName));
  }, [setFieldTouched]);

  useEffect(() => {
    // Set all fields as touched if user navigates away from this panel (on unmount)
    return () => setAllFieldsTouched();
  }, [setAllFieldsTouched]);

  // const validateAndSave = () => {
  //   setAllFieldsTouched();
  //   savePublication();
  // };

  return (
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={savePublication}>
      <StyledCard>
        <Heading>{t('contributors.authors')}</Heading>
        <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
          {({ push, remove, swap }) => (
            <SortableTable
              listOfContributors={getIn(values, ContributorFieldNames.CONTRIBUTORS)}
              push={push}
              remove={remove}
              swap={swap}
            />
          )}
        </FieldArray>
      </StyledCard>
    </TabPanel>
  );
};

export default ContributorsPanel;
