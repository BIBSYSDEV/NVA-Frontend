import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText } from '@material-ui/core';
import { FormikProps, useFormikContext, FieldArray, ErrorMessage, FieldArrayRenderProps } from 'formik';
import Heading from '../../components/Heading';
import Card from '../../components/Card';
import SortableTable from './contributors_tab/components/SortableTable';
import { Publication } from '../../types/publication.types';
import { ContributorFieldNames } from '../../types/publicationFieldNames';
import { touchedContributorTabFields } from '../../utils/formik-helpers';
import { PanelProps } from './PublicationFormContent';

const ContributorsPanel: FC<PanelProps> = ({ setTouchedFields }) => {
  const { t } = useTranslation('publication');
  const {
    values: {
      entityDescription: { contributors },
    },
  }: FormikProps<Publication> = useFormikContext();

  const contributorsRef = useRef(contributors);
  useEffect(() => {
    contributorsRef.current = contributors;
  }, [contributors]);

  useEffect(
    // Set all fields to touched on unmount
    // Use refs to avoid trigging this useEffect on every values update
    () => () => setTouchedFields(touchedContributorTabFields(contributorsRef.current)),
    [setTouchedFields]
  );

  return (
    <Card>
      <Heading>{t('contributors.authors')}</Heading>
      <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
        {({ push, remove, replace, name }: FieldArrayRenderProps) => (
          <>
            <SortableTable push={push} remove={remove} replace={replace} />
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
