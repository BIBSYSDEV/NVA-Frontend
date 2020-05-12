import { FormikProps, useFormikContext, FormikTouched } from 'formik';
import React, { FC, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { FormikPublication } from '../../types/publication.types';
import DescriptionPanel from './DescriptionPanel';
import ReferencesPanel from './ReferencesPanel';
import ContributorsPanel from './ContributorsPanel';
import FilesAndLicensePanel from './FilesAndLicensePanel';
import SubmissionPanel from './SubmissionPanel';
import { Uppy } from '../../types/file.types';
import { mergeTouchedFields } from '../../utils/formik-helpers';

const StyledPanel = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

export interface PanelProps {
  setTouchedFields: (fieldsToTouch: FormikTouched<FormikPublication>) => void;
}

interface PublicationFormContentProps {
  isSaving: boolean;
  savePublication: (values: FormikPublication) => void;
  tabNumber: number;
  uppy: Uppy;
}

export const PublicationFormContent: FC<PublicationFormContentProps> = ({
  isSaving,
  savePublication,
  tabNumber,
  uppy,
}) => {
  const { touched, setTouched }: FormikProps<FormikPublication> = useFormikContext();

  const touchedRef = useRef(touched);
  useEffect(() => {
    touchedRef.current = touched;
  }, [touched]);

  const setTouchedFields = useCallback(
    (fieldsToTouch: FormikTouched<FormikPublication>) =>
      setTouched(mergeTouchedFields([touchedRef.current, fieldsToTouch])),
    [setTouched]
  );

  return (
    <>
      {tabNumber === 0 && (
        <StyledPanel aria-label="description">
          <DescriptionPanel setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
      {tabNumber === 1 && (
        <StyledPanel aria-label="references">
          <ReferencesPanel setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
      {tabNumber === 2 && (
        <StyledPanel aria-label="references">
          <ContributorsPanel setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
      {tabNumber === 3 && (
        <StyledPanel aria-label="files and license">
          <FilesAndLicensePanel setTouchedFields={setTouchedFields} uppy={uppy} />
        </StyledPanel>
      )}
      {tabNumber === 4 && (
        <StyledPanel aria-label="submission">
          <SubmissionPanel isSaving={isSaving} savePublication={savePublication} setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
    </>
  );
};
