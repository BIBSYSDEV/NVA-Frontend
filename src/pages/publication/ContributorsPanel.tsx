import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText } from '@material-ui/core';
import { FormikProps, useFormikContext, FieldArray, ErrorMessage, FieldArrayRenderProps } from 'formik';
import Heading from '../../components/Heading';
import Card from '../../components/Card';
import SortableTable from './contributors_tab/components/SortableTable';
import { FormikPublication } from '../../types/publication.types';
import { ContributorFieldNames } from '../../types/publicationFieldNames';
import { touchedContributorTabFields, mergeTouchedFields } from '../../utils/formik-helpers';

const ContributorsPanel: FC = () => {
  const { t } = useTranslation('publication');
  const {
    setTouched,
    touched,
    values: {
      entityDescription: { contributors },
    },
  }: FormikProps<FormikPublication> = useFormikContext();

  const contributorsRef = useRef(contributors);
  useEffect(() => {
    contributorsRef.current = contributors;
  }, [contributors]);

  const touchedRef = useRef(touched);
  useEffect(() => {
    touchedRef.current = touched;
  }, [touched]);

  useEffect(
    // Set all fields to touched on unmount
    // Use refs to avoid trigging this useEffect on every values update
    () => () =>
      setTouched(mergeTouchedFields([touchedRef.current, touchedContributorTabFields(contributorsRef.current)])),
    [setTouched]
  );

  return (
    <Card>
      <Heading>{t('contributors.authors')}</Heading>
      <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
        {({ push, remove, move, replace, name }: FieldArrayRenderProps) => (
          <>
            <SortableTable push={push} remove={remove} move={move} replace={replace} />
            {contributors.length === 0 && (
              <FormHelperText error>
                <ErrorMessage name={name} />
              </FormHelperText>
            )}
          </>
        )}
      </FieldArray>
    </Card>
  );
};

export default ContributorsPanel;
