import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { TextField, Button } from '@mui/material';
import { Field, FieldProps, useFormikContext, getIn } from 'formik';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';

export const AlternativeAbstractsFields = ({
  disableChannelClaimsFields,
  t,
  dataTestId,
}: {
  disableChannelClaimsFields: boolean;
  t: any;
  dataTestId: any;
}) => {
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
              label={`${t('registration.description.alternative_abstract')} (${langKey})`}
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
