import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, TextField } from '@mui/material';
import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { dataTestId } from '../../utils/dataTestIds';

interface AlternativeAbstractsFieldsProps {
  disableChannelClaimsFields: boolean;
}

export const AlternativeAbstractsFields = ({ disableChannelClaimsFields }: AlternativeAbstractsFieldsProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<any>();
  const alternativeAbstracts = getIn(values, DescriptionFieldNames.AlternativeAbstracts) ?? {};
  const hasAny = Object.keys(alternativeAbstracts).length > 0;

  return (
    <>
      {Object.keys(alternativeAbstracts).map((langKey) => (
        <Field key={langKey} name={`${DescriptionFieldNames.AlternativeAbstracts}.${langKey}`}>
          {({ field }: FieldProps<string>) => (
            <TextField
              {...field}
              disabled={disableChannelClaimsFields}
              value={field.value ?? ''}
              data-testid={dataTestId.registrationWizard.description.alternativeAbstractField}
              variant="filled"
              fullWidth
              multiline
              label={t('registration.description.alternative_abstract')}
            />
          )}
        </Field>
      ))}

      {!hasAny && (
        <Button
          color="tertiary"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          disabled={!values.entityDescription?.abstract || disableChannelClaimsFields}
          onClick={() => setFieldValue(`${DescriptionFieldNames.AlternativeAbstracts}.und`, '')}>
          {t('common.add_custom', {
            name: t('registration.description.alternative_abstract').toLocaleLowerCase(),
          })}
        </Button>
      )}
    </>
  );
};
