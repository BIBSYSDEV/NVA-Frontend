import React, { FC } from 'react';
import styled from 'styled-components';

import { RegistrationTab } from '../../types/registration.types';
import DescriptionPanel from './DescriptionPanel';
import ReferencesPanel from './ReferencesPanel';
import ContributorsPanel from './ContributorsPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import { Uppy } from '../../types/file.types';

const StyledPanel = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

interface RegistrationFormContentProps {
  tabNumber: RegistrationTab;
  uppy: Uppy;
}

export const RegistrationFormContent: FC<RegistrationFormContentProps> = ({ tabNumber, uppy }) => {
  return (
    <>
      {tabNumber === RegistrationTab.Description && (
        <StyledPanel>
          <DescriptionPanel />
        </StyledPanel>
      )}
      {tabNumber === RegistrationTab.Reference && (
        <StyledPanel>
          <ReferencesPanel />
        </StyledPanel>
      )}
      {tabNumber === RegistrationTab.Contributors && (
        <StyledPanel>
          <ContributorsPanel />
        </StyledPanel>
      )}
      {tabNumber === RegistrationTab.FilesAndLicenses && (
        <StyledPanel>
          <FilesAndLicensePanel uppy={uppy} />
        </StyledPanel>
      )}
    </>
  );
};
