import { FormikProps, useFormikContext, FormikTouched } from 'formik';
import React, { FC, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { Publication, PublicationTab } from '../../types/publication.types';
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
  setTouchedFields: (fieldsToTouch: FormikTouched<Publication>) => void;
}

interface PublicationFormContentProps {
  isSaving: boolean;
  savePublication: (values: Publication) => void;
  tabNumber: number;
  uppy: Uppy;
}

export const PublicationFormContent: FC<PublicationFormContentProps> = ({
  isSaving,
  savePublication,
  tabNumber,
  uppy,
}) => {
  const { touched, setTouched }: FormikProps<Publication> = useFormikContext();

  const touchedRef = useRef(touched);
  useEffect(() => {
    touchedRef.current = touched;
  }, [touched]);

  const setTouchedFields = useCallback(
    (fieldsToTouch: FormikTouched<Publication>) => setTouched(mergeTouchedFields([touchedRef.current, fieldsToTouch])),
    [setTouched]
  );

  return (
    <>
      {tabNumber === PublicationTab.Description && (
        <StyledPanel>
          <DescriptionPanel setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
      {tabNumber === PublicationTab.Reference && (
        <StyledPanel>
          <ReferencesPanel setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
      {tabNumber === PublicationTab.Contributors && (
        <StyledPanel>
          <ContributorsPanel setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
      {tabNumber === PublicationTab.FilesAndLicenses && (
        <StyledPanel>
          <FilesAndLicensePanel setTouchedFields={setTouchedFields} uppy={uppy} />
        </StyledPanel>
      )}
      {tabNumber === PublicationTab.Submission && (
        <StyledPanel>
          <SubmissionPanel isSaving={isSaving} savePublication={savePublication} setTouchedFields={setTouchedFields} />
        </StyledPanel>
      )}
    </>
  );
};
