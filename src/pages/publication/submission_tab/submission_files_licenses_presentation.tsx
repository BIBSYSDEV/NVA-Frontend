import LabelContentLine from '../../../components/LabelContentLine';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import styled from 'styled-components';

const StyledContentText = styled.div`
  margin-bottom: 0.3rem;
  font-weight: bold;
`;

const SubmissionFilesAndLicensesPresentation: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <LabelContentLine label={t('files_and_license.files')}>
        {values.files.map(file => {
          return (
            <StyledContentText>
              {file.title}({file.license})
            </StyledContentText>
          );
        })}
      </LabelContentLine>
    </>
  );
};

export default SubmissionFilesAndLicensesPresentation;
