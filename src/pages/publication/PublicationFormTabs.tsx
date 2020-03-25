import { FormikErrors, FormikProps, FormikTouched, useFormikContext, getIn } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs } from '@material-ui/core';

import LinkTab from '../../components/TabPanel/LinkTab';
import { FormikPublication } from '../../types/publication.types';
import { PublicationFieldNames, DescriptionFieldNames } from '../../types/references.types';

const a11yProps = (tabDescription: string) => {
  return {
    id: `nav-tab-${tabDescription}`,
    'aria-controls': `nav-tabpanel-${tabDescription}`,
    'data-testid': `nav-tabpanel-${tabDescription}`,
  };
};

const descriptionFieldNames = Object.values(DescriptionFieldNames);
const publicationFieldNames = Object.values(PublicationFieldNames);

interface PublicationFormTabsProps {
  handleTabChange: (_: React.ChangeEvent<{}>, newValue: number) => void;
  tabNumber: number;
}

export const PublicationFormTabs: FC<PublicationFormTabsProps> = ({ handleTabChange, tabNumber }) => {
  const { t } = useTranslation('publication');
  const { errors, touched, values }: FormikProps<FormikPublication> = useFormikContext();
  const submissionLabel = getIn(values, PublicationFieldNames.DOI)
    ? t('heading.registration')
    : t('heading.publishing');

  return (
    <Tabs variant="fullWidth" value={tabNumber} onChange={handleTabChange} aria-label="navigation" textColor="primary">
      <LinkTab
        label={`1. ${t('heading.description')}`}
        {...a11yProps('description')}
        error={hasTouchedError(errors, touched, descriptionFieldNames)}
      />
      <LinkTab
        label={`2. ${t('heading.references')}`}
        {...a11yProps('references')}
        error={hasTouchedError(errors, touched, publicationFieldNames)}
      />
      <LinkTab label={`3. ${t('heading.contributors')}`} {...a11yProps('contributors')} error={false} />
      <LinkTab label={`4. ${t('heading.files_and_license')}`} {...a11yProps('files-and-license')} />
      <LinkTab label={`5. ${submissionLabel}`} {...a11yProps('submission')} />
    </Tabs>
  );
};

const hasTouchedError = (
  errors: FormikErrors<FormikPublication>,
  touched: FormikTouched<FormikPublication>,
  fieldNames: string[]
): boolean => {
  if (!Object.keys(errors).length || !Object.keys(touched).length || !fieldNames.length) {
    return false;
  }

  return fieldNames.some(fieldName => {
    const fieldHasError = !!getIn(errors, fieldName);
    const fieldIsTouched = getIn(touched, fieldName);
    return fieldHasError && fieldIsTouched;
  });
};
