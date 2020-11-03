import LabelContentRow from '../../../components/LabelContentRow';
import React, { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Registration } from '../../../types/registration.types';

const SubmissionFilesAndLicenses: FC = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<Registration>();

  return (
    <>
      {values.fileSet.files.map((file) => (
        <Fragment key={file.identifier}>
          <LabelContentRow label={t('files_and_license.title')}>{file.name}</LabelContentRow>
          <LabelContentRow label={t('files_and_license.administrative_contract')}>
            {file.administrativeAgreement ? t('common:yes') : t('common:no')}
          </LabelContentRow>
          {!file.administrativeAgreement && (
            <>
              <LabelContentRow label={t('files_and_license.published_version')}>
                {file.publisherAuthority !== null ? (file.publisherAuthority ? t('common:yes') : t('common:no')) : ''}
              </LabelContentRow>
              <LabelContentRow label={t('files_and_license.embargo_date')}>
                {file.embargoDate && new Date(file.embargoDate).toLocaleDateString()}
              </LabelContentRow>
              <LabelContentRow label={t('files_and_license.license')}>{file.license?.identifier}</LabelContentRow>
            </>
          )}
        </Fragment>
      ))}
    </>
  );
};

export default SubmissionFilesAndLicenses;
