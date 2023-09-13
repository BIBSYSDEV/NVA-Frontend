import { LoadingButton } from '@mui/lab';
import { Box, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerson, updateCristinPerson } from '../../../api/cristinApi';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { FlatCristinPerson } from '../../../types/user.types';
import { ResearchProfilePanel } from './ResearchProfilePanel';

type CristinPersonFormData = Pick<FlatCristinPerson, 'background'>;

export const MyPageMyFieldAndBackground = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootState) => store.user)!;
  const personId = user?.cristinId ?? '';

  const personQuery = useQuery({
    queryKey: [personId],
    queryFn: () => fetchPerson(personId),
    meta: { message: t('feedback.error.get_person'), variant: 'error' },
  });

  const person = personQuery.data;
  const personBackground = person?.background ?? {};

  const initialValues: CristinPersonFormData = {
    background: {
      no: personBackground.no ? personBackground.no : '',
      en: personBackground.en ? personBackground.en : '',
    },
  };

  const updatePerson = useMutation({
    mutationKey: ['update-person', user.cristinId],
    mutationFn: async (values: CristinPersonFormData) => {
      if (user.cristinId) {
        const payload: CristinPersonFormData = {
          background: {
            no: values.background.no === '' ? null : values.background.no,
            en: values.background.en === '' ? null : values.background.en,
          },
        };
        await updateCristinPerson(user.cristinId, payload);
      }
    },
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.update_person'), variant: 'success' }));
      personQuery.refetch();
    },
    onError: () => {
      dispatch(setNotification({ message: t('feedback.error.update_person'), variant: 'error' }));
    },
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '3fr 1fr',
        },
        columnGap: '1rem',
        gridTemplateAreas: {
          xs: '"field-and-background" "research-profile"',
          md: '"user-profile research-profile" ',
        },
      }}>
      <BackgroundDiv
        sx={{
          bgcolor: 'info.light',
        }}>
        <Typography variant="h2">{t('my_page.my_profile.background')}</Typography>
        <Formik initialValues={initialValues} onSubmit={(values) => updatePerson.mutate(values)} enableReinitialize>
          {({ isSubmitting, dirty }: FormikProps<CristinPersonFormData>) => (
            <Form>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
                <Typography variant="h3">{t('my_page.my_profile.norwegian')}</Typography>
                <Field name={'background.no'}>
                  {({ field }: FieldProps<string>) => (
                    <>
                      <TextField
                        {...field}
                        inputProps={{ maxLength: 200 }}
                        label={'Bakgrunn'}
                        id={field.name}
                        variant="filled"
                        multiline
                        rows="3"
                        placeholder="Skriv inn"
                      />
                      <Typography sx={{ alignSelf: 'end' }}>{field.value.length}/200</Typography>
                    </>
                  )}
                </Field>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
                <Typography variant="h3">{t('my_page.my_profile.english')}</Typography>
                <Field name={'background.en'}>
                  {({ field }: FieldProps<string>) => (
                    <>
                      <TextField
                        {...field}
                        inputProps={{ maxLength: 200 }}
                        label={'Background'}
                        id={field.name}
                        variant="filled"
                        multiline
                        rows="3"
                        placeholder="Skriv inn"
                      />
                      <Typography sx={{ alignSelf: 'end' }}>{field.value.length}/200</Typography>
                    </>
                  )}
                </Field>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'right', mt: '1rem' }}>
                <LoadingButton loading={isSubmitting} disabled={!dirty} variant="contained" type="submit">
                  {t('common.save')}
                </LoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
      </BackgroundDiv>
      <Box sx={{ gridArea: 'research-profile' }}>
        <ResearchProfilePanel person={person} isLoadingPerson={personQuery.isLoading} />
      </Box>
    </Box>
  );
};
