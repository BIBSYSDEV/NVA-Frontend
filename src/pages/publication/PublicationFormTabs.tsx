import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs } from '@material-ui/core';

import LinkTab from '../../components/LinkTab';
import { FormikPublication } from '../../types/publication.types';
import { ReferenceFieldNames, DescriptionFieldNames } from '../../types/publicationFieldNames';
import { hasTouchedError, getAllFileFields, getAllContributorFields } from '../../utils/formik-helpers';
import styled from 'styled-components';

const StyledTabs = styled(Tabs)`
  background-color: ${({ theme }) => theme.overrides.MuiTab.root.background};
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

interface PublicationFormTabsProps {
  handleTabChange: (_: React.ChangeEvent<{}>, newValue: number) => void;
  tabNumber: number;
}

export const PublicationFormTabs: FC<PublicationFormTabsProps> = ({ handleTabChange, tabNumber }) => {
  const { t } = useTranslation('publication');
  const { errors, touched, values }: FormikProps<FormikPublication> = useFormikContext();
  const {
    entityDescription: {
      contributors,
      reference: { doi },
    },
    fileSet: { files = [] },
  } = values;

  return (
    <StyledTabs
      aria-label="navigation"
      onChange={handleTabChange}
      scrollButtons="auto"
      textColor="primary"
      value={tabNumber}
      variant="scrollable">
      <LinkTab
        label={`1. ${t('heading.description')}`}
        {...a11yProps('description')}
        error={hasTouchedError(errors, touched, descriptionFieldNames)}
      />
      <LinkTab
        label={`2. ${t('heading.references')}`}
        {...a11yProps('references')}
        error={hasTouchedError(errors, touched, referenceFieldNames)}
      />
      <LinkTab
        label={`3. ${t('heading.contributors')}`}
        {...a11yProps('contributors')}
        error={hasTouchedError(errors, touched, getAllContributorFields(contributors))}
      />
      <LinkTab
        label={`4. ${t('heading.files_and_license')}`}
        {...a11yProps('files-and-license')}
        error={hasTouchedError(errors, touched, getAllFileFields(files))}
      />
      <LinkTab label={`5. ${doi ? t('heading.registration') : t('heading.publishing')}`} {...a11yProps('submission')} />
    </StyledTabs>
  );
};
