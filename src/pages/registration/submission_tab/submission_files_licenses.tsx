import LabelContentRow from '../../../components/LabelContentRow';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Registration } from '../../../types/registration.types';
import Card from '../../../components/Card';

const SubmissionFilesAndLicenses: FC = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<Registration>();

  return (
    <>
      {values.fileSet.files.map((file) => (
        <Card key={file.identifier}>
          <LabelContentRow label={t('files_and_license.title')}>{file.name}</LabelContentRow>
          <LabelContentRow label={t('files_and_license.publicly_available')}>
            {file.administrativeAgreement ? t('common:no') : t('common:yes')}
          </LabelContentRow>
          {!file.administrativeAgreement && (
            <>
              <LabelContentRow label={t('files_and_license.published_version')}>
                {file.publisherAuthority !== null ? (file.publisherAuthority ? t('common:yes') : t('common:no')) : ''}
              </LabelContentRow>
              {file.embargoDate && (
                <LabelContentRow label={t('files_and_license.embargo_date')}>
                  {file.embargoDate && new Date(file.embargoDate).toLocaleDateString()}
                </LabelContentRow>
              )}
              <LabelContentRow label={t('files_and_license.conditions_for_using_file')}>
                {file.license?.identifier}
              </LabelContentRow>
            </>
          )}
        </Card>
      ))}
    </>
  );
};

export default SubmissionFilesAndLicenses;
