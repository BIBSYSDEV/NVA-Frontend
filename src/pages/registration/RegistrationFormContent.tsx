import { useFormikContext, FormikTouched } from 'formik';
import React, { FC, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { Registration, RegistrationTab } from '../../types/registration.types';
import DescriptionPanel from './DescriptionPanel';
import ReferencesPanel from './ReferencesPanel';
import ContributorsPanel from './ContributorsPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import { Uppy } from '../../types/file.types';
import { mergeTouchedFields } from '../../utils/formik-helpers';

const StyledPanel = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

export interface PanelProps {
  setTouchedFields: (fieldsToTouch: FormikTouched<Registration>) => void;
}

interface RegistrationFormContentProps {
  tabNumber: number;
  uppy: Uppy;
}

export const RegistrationFormContent: FC<RegistrationFormContentProps> = ({ tabNumber, uppy }) => {
  const { touched, setTouched } = useFormikContext<Registration>();

  const touchedRef = useRef(touched);
  useEffect(() => {
    touchedRef.current = touched;
  }, [touched]);

  const setTouchedFields = useCallback(
    (fieldsToTouch: FormikTouched<Registration>) => setTouched(mergeTouchedFields([touchedRef.current, fieldsToTouch])),
    [setTouched]
  );

  return (
    <>
      {tabNumber === RegistrationTab.Description && (
        <StyledPanel>
          <DescriptionPanel setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
      {tabNumber === RegistrationTab.Reference && (
        <StyledPanel>
          <ReferencesPanel setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
      {tabNumber === RegistrationTab.Contributors && (
        <StyledPanel>
          <ContributorsPanel setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
      {tabNumber === RegistrationTab.FilesAndLicenses && (
        <StyledPanel>
          <FilesAndLicensePanel setTouchedFields={setTouchedFields} uppy={uppy} />
        </StyledPanel>
      )}
    </>
  );
};
