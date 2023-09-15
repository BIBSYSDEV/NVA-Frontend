import { LoadingButton } from '@mui/lab';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerson, searchForKeywords, updateCristinPerson } from '../../../api/cristinApi';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { FlatCristinPerson } from '../../../types/user.types';
import { SearchTextField } from '../../search/SearchTextField';
import { ResearchProfilePanel } from './ResearchProfilePanel';

type PersonBackgroundFormData = Pick<FlatCristinPerson, 'background'>;

export const MyFieldAndBackground = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector((store: RootState) => store.user);
  const personId = user?.cristinId ?? '';

  const [keywordQuery, setKeywordQuery] = useState('');

  const personQuery = useQuery({
    queryKey: [personId],
    queryFn: () => fetchPerson(personId),
    meta: { message: t('feedback.error.get_person'), variant: 'error' },
  });

  const person = personQuery.data;
  const personBackground = person?.background ?? {};

  const fieldQuery = useQuery({
    enabled: !!keywordQuery,
    queryKey: ['field', keywordQuery],
    queryFn: () => searchForKeywords(10, 1, keywordQuery),
    meta: { message: 'error', variant: 'error' },
  });

  const initialValues: PersonBackgroundFormData = {
    background: {
      no: personBackground.no ? personBackground.no : '',
      en: personBackground.en ? personBackground.en : '',
    },
  };

  const updatePerson = useMutation({
    mutationFn: async (values: PersonBackgroundFormData) => {
      if (personId) {
        const payload: PersonBackgroundFormData = {
          background: {
            no: values.background.no === '' ? null : values.background.no,
            en: values.background.en === '' ? null : values.background.en,
          },
        };
        await updateCristinPerson(personId, payload);
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
        rowGap: '1rem',
        gridTemplateAreas: {
          xs: '"field-and-background" "research-profile"',
          md: '"field-and-background research-profile"',
        },
      }}>
      <BackgroundDiv
        sx={{
          bgcolor: 'info.light',
        }}>
        <Formik initialValues={initialValues} onSubmit={(values) => updatePerson.mutate(values)} enableReinitialize>
          {({ isSubmitting, dirty }: FormikProps<PersonBackgroundFormData>) => (
            <>
              <Box>
                <Typography variant="h2">{t('my_page.my_profile.field_and_background.field')}</Typography>
                <Typography variant="h3" sx={{ mb: '1rem', mt: '1.5rem' }}>
                  {t('my_page.my_profile.field_and_background.field_text')}
                </Typography>
                <SearchTextField sx={{ bgcolor: 'white' }} onChange={(event) => setKeywordQuery(event.target.value)} />
                <Typography variant="body1" fontStyle={'italic'} sx={{ mb: '2rem' }}>
                  {t('my_page.my_profile.field_and_background.keywords_search_text')}
                </Typography>
                <Typography variant="h3" sx={{ mb: '1rem', mt: '1.5rem' }}>
                  {t('my_page.my_profile.field_and_background.geographical_area')}
                </Typography>
                <SearchTextField sx={{ bgcolor: 'white' }} />
                <Typography variant="body1" fontStyle={'italic'}>
                  {t('my_page.my_profile.field_and_background.keywords_search_text')}
                </Typography>
              </Box>
              <Form>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '4rem' }}>
                  <Typography variant="h2" sx={{ mb: '1rem' }}>
                    {t('my_page.my_profile.background')}
                  </Typography>
                  <Typography variant="h3">{t('my_page.my_profile.field_and_background.norwegian')}</Typography>
                  <Field name={'background.no'}>
                    {({ field }: FieldProps<string>) => (
                      <>
                        <TextField
                          {...field}
                          inputProps={{ maxLength: 200 }}
                          label={t('my_page.my_profile.background')}
                          variant="filled"
                          multiline
                          rows="3"
                          placeholder={t('my_page.my_profile.field_and_background.background_placeholder')}
                        />
                        <Typography sx={{ alignSelf: 'end' }}>{field.value.length}/200</Typography>
                      </>
                    )}
                  </Field>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
                  <Typography variant="h3">{t('my_page.my_profile.field_and_background.english')}</Typography>
                  <Field name={'background.en'}>
                    {({ field }: FieldProps<string>) => (
                      <>
                        <TextField
                          {...field}
                          inputProps={{ maxLength: 200 }}
                          label={t('my_page.my_profile.background')}
                          variant="filled"
                          multiline
                          rows="3"
                          placeholder={t('my_page.my_profile.field_and_background.background_placeholder')}
                        />
                        <Typography sx={{ alignSelf: 'end' }}>{field.value.length}/200</Typography>
                      </>
                    )}
                  </Field>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: '1rem' }}>
                  <Button>{t('common.cancel')}</Button>
                  <LoadingButton loading={isSubmitting} disabled={!dirty} variant="contained" type="submit">
                    {t('common.save')}
                  </LoadingButton>
                </Box>
              </Form>
            </>
          )}
        </Formik>
      </BackgroundDiv>
      <Box sx={{ gridArea: 'research-profile' }}>
        <ResearchProfilePanel person={person} isLoadingPerson={personQuery.isLoading} />
      </Box>
    </Box>
  );
};
