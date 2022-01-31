import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, Form, Formik } from 'formik';
import { TextField } from '@mui/material';
import { setNotification } from '../../redux/actions/notificationActions';
import { InputContainerBox } from '../../components/styled/Wrappers';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { CristinUser } from './CristinUsersPage';
import { LoadingButton } from '@mui/lab';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { useCancelToken } from '../../utils/hooks/useCancelToken';

const initialValuesCristinUser: Partial<CristinUser> = {
  identifiers: [{ type: 'NationalIdentificationNumber', value: '' }],
  names: [
    { type: 'FirstName', value: '' },
    { type: 'LastName', value: '' },
  ],
};

export const CristinUserForm = () => {
  const { t } = useTranslation('admin');
  const dispatch = useDispatch();
  const cancelToken = useCancelToken();

  const handleSubmit = async (values: Partial<CristinUser>) => {
    console.log('SUBMIT', values);

    const createUserResponse = await authenticatedApiRequest<any>({
      url: '/cristin/person',
      method: 'POST',
      data: values,
      cancelToken,
    });
    console.log(createUserResponse);

    if (isErrorStatus(createUserResponse.status)) {
      dispatch(setNotification(t('feedback:error.created_cristin_user'), 'error'));
    } else if (isSuccessStatus(createUserResponse.status)) {
      dispatch(setNotification(t('feedback:success.created_cristin_user')));
    }
  };

  return (
    <Formik initialValues={initialValuesCristinUser} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form noValidate>
          <InputContainerBox>
            <Field name={'identifiers[0].value'}>
              {({ field }: FieldProps<string>) => (
                <TextField {...field} label={'Personnummer'} value={field.value ?? ''} variant="filled" />
              )}
            </Field>
            <Field name={'names[0].value'}>
              {({ field }: FieldProps<string>) => (
                <TextField {...field} label={'First name'} value={field.value ?? ''} variant="filled" />
              )}
            </Field>
            <Field name={'names[1].value'}>
              {({ field }: FieldProps<string>) => (
                <TextField {...field} label={'First name'} value={field.value ?? ''} variant="filled" />
              )}
            </Field>
            <LoadingButton variant="contained" loading={isSubmitting} type="submit">
              Lagre
            </LoadingButton>
          </InputContainerBox>
        </Form>
      )}
    </Formik>
  );
};
