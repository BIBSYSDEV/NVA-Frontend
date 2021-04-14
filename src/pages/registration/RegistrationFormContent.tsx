import React from 'react';
import styled from 'styled-components';

import { RegistrationTab } from '../../types/registration.types';
import DescriptionPanel from './DescriptionPanel';
import ContributorsPanel from './ContributorsPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import { Uppy } from '../../types/file.types';
import { ResourceTypePanel } from './ResourceTypePanel';

const StyledPanel = styled.div`
  margin-bottom: 1rem;
`;

interface RegistrationFormContentProps {
  tabNumber: RegistrationTab;
  uppy: Uppy;
}

export const RegistrationFormContent = ({ tabNumber, uppy }: RegistrationFormContentProps) => (
  <StyledPanel id="form">
    {tabNumber === RegistrationTab.Description && <DescriptionPanel />}
    {tabNumber === RegistrationTab.ResourceType && <ResourceTypePanel />}
    {tabNumber === RegistrationTab.Contributors && <ContributorsPanel />}
    {tabNumber === RegistrationTab.FilesAndLicenses && <FilesAndLicensePanel uppy={uppy} />}
  </StyledPanel>
);
