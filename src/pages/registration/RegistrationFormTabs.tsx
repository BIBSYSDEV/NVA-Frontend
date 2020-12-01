import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Tabs } from '@material-ui/core';

import LinkTab from '../../components/LinkTab';
import { Registration } from '../../types/registration.types';
import { ReferenceFieldNames, DescriptionFieldNames } from '../../types/publicationFieldNames';
import { hasTouchedError, getAllFileFields, getAllContributorFields } from '../../utils/formik-helpers';

const StyledTabs = styled(Tabs)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    .MuiTabs-flexContainer {
      justify-content: center;
    }
  }
`;

const a11yProps = (tabDescription: string) => {
  return {
    id: `nav-tab-${tabDescription}`,
    'aria-controls': `nav-tabpanel-${tabDescription}`,
    'data-testid': `nav-tabpanel-${tabDescription}`,
  };
};

const descriptionFieldNames = Object.values(DescriptionFieldNames);
const referenceFieldNames = Object.values(ReferenceFieldNames);

interface RegistrationFormTabsProps {
  setTabNumber: (newTab: number) => void;
  tabNumber: number;
}

export const RegistrationFormTabs: FC<RegistrationFormTabsProps> = ({ setTabNumber, tabNumber }) => {
  const { t } = useTranslation('registration');
  const { errors, touched, values } = useFormikContext<Registration>();
  const {
    entityDescription: { contributors },
    fileSet: { files = [] },
  } = values;

  return (
    <StyledTabs
      aria-label="navigation"
      onChange={(_, value) => setTabNumber(value)}
      scrollButtons="auto"
      textColor="primary"
      indicatorColor="primary"
      value={tabNumber}
      variant="scrollable">
      <LinkTab
        label={t('heading.description')}
        {...a11yProps('description')}
        error={hasTouchedError(errors, touched, descriptionFieldNames)}
      />
      <LinkTab
        label={t('heading.reference')}
        {...a11yProps('reference')}
        error={hasTouchedError(errors, touched, referenceFieldNames)}
      />
      <LinkTab
        label={t('heading.contributors')}
        {...a11yProps('contributors')}
        error={hasTouchedError(errors, touched, getAllContributorFields(contributors))}
      />
      <LinkTab
        label={t('heading.files_and_license')}
        {...a11yProps('files-and-license')}
        error={hasTouchedError(errors, touched, getAllFileFields(files))}
      />
      <LinkTab label={t('heading.summary')} {...a11yProps('submission')} />
    </StyledTabs>
  );
};
