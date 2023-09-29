import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, Chip, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerson, searchForKeywords, updateCristinPerson } from '../../../api/cristinApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { Keywords } from '../../../types/keywords.types';
import { FlatCristinPerson } from '../../../types/user.types';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getLanguageString } from '../../../utils/translation-helpers';
import { ResearchProfilePanel } from './ResearchProfilePanel';

type PersonBackgroundFormData = Pick<FlatCristinPerson, 'background' | 'keywords'>;

export const MyFieldAndBackground = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector((store: RootState) => store.user);
  const personId = user?.cristinId ?? '';

  const [keywordSearchTerm, setKeywordSearchTerm] = useState('');
  const debouncedKeywordsSearchTerm = useDebounce(keywordSearchTerm);

  const personQuery = useQuery({
    queryKey: [personId],
    queryFn: () => fetchPerson(personId),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const person = personQuery.data;
  const personBackground = person?.background ?? {};
  const personKeywords = person?.keywords ?? [];

  const keywordsQuery = useQuery({
    enabled: !!debouncedKeywordsSearchTerm,
    queryKey: ['keywords', debouncedKeywordsSearchTerm],
    queryFn: () => searchForKeywords(25, 1, debouncedKeywordsSearchTerm),
    meta: { errorMessage: t('feedback.error.get_keywords') },
  });

  const keywordsResult = keywordsQuery.data?.hits ?? [];

  const initialValues: PersonBackgroundFormData = {
    background: {
      no: personBackground.no ?? '',
      en: personBackground.en ?? '',
    },
    keywords: personKeywords ?? [],
  };

  const updatePerson = useMutation({
    mutationFn: async (values: PersonBackgroundFormData) => {
      if (personId) {
        const payload: PersonBackgroundFormData = {
          background: {
            no: values.background.no === '' ? null : values.background.no,
            en: values.background.en === '' ? null : values.background.en,
          },
          keywords: values.keywords,
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

  const maxMessageLength = 500;

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
          {({ isSubmitting, dirty, setFieldValue, resetForm }: FormikProps<PersonBackgroundFormData>) => (
            <Form>
              <Box>
                <Typography variant="h2">{t('my_page.my_profile.field_and_background.field')}</Typography>
                <Typography variant="h3" sx={{ mb: '1rem', mt: '1.5rem' }}>
                  {t('my_page.my_profile.field_and_background.field_text')}
                </Typography>
                <Field name={'keywords'}>
                  {({ field }: FieldProps<Keywords[]>) => (
                    <Autocomplete
                      {...field}
                      loading={keywordsQuery.isFetching}
                      value={field.value ?? []}
                      multiple
                      options={keywordsResult}
                      isOptionEqualToValue={(option, value) => option.type === value.type}
                      getOptionLabel={(option) => getLanguageString(option.label)}
                      getOptionDisabled={(option) => field.value.some((keyword) => keyword.type === option.type)}
                      renderOption={(props, option) => (
                        <li {...props} key={option.type}>
                          <Typography>{getLanguageString(option.label)}</Typography>
                        </li>
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={index} label={getLanguageString(option.label)} />
                        ))
                      }
                      filterOptions={(options) => options}
                      autoComplete
                      onInputChange={(_, newInputValue) => setKeywordSearchTerm(newInputValue)}
                      onChange={(_, value) => {
                        setFieldValue(field.name, value);
                      }}
                      renderInput={(params) => (
                        <AutocompleteTextField
                          {...params}
                          isLoading={keywordsQuery.isFetching}
                          label={t('registration.description.keywords')}
                          placeholder={t('common.search')}
                          showSearchIcon={field.value.length === 0}
                        />
                      )}
                    />
                  )}
                </Field>
                <Typography variant="body1" fontStyle={'italic'} sx={{ mb: '2rem' }}>
                  {t('my_page.my_profile.field_and_background.keywords_search_text')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '4rem' }}>
                <Typography variant="h2" sx={{ mb: '1rem' }}>
                  {t('my_page.my_profile.background')}
                </Typography>
                <Typography variant="h3">{t('my_page.my_profile.field_and_background.norwegian')}</Typography>
                <Field name={'background.no'}>
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      inputProps={{ maxLength: maxMessageLength }}
                      label={t('my_page.my_profile.background')}
                      variant="filled"
                      multiline
                      rows="3"
                      placeholder={t('my_page.my_profile.field_and_background.background_placeholder')}
                      helperText={`${field.value.length}/${maxMessageLength}`}
                      FormHelperTextProps={{ sx: { textAlign: 'end' } }}
                    />
                  )}
                </Field>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
                <Typography variant="h3">{t('my_page.my_profile.field_and_background.english')}</Typography>
                <Field name={'background.en'}>
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      inputProps={{ maxLength: maxMessageLength }}
                      label={t('my_page.my_profile.background')}
                      variant="filled"
                      multiline
                      rows="3"
                      placeholder={t('my_page.my_profile.field_and_background.background_placeholder')}
                      helperText={`${field.value.length}/${maxMessageLength}`}
                      FormHelperTextProps={{ sx: { textAlign: 'end' } }}
                    />
                  )}
                </Field>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: '1rem', gap: '1rem' }}>
                <Button
                  onClick={() => {
                    resetForm();
                  }}>
                  {t('common.cancel')}
                </Button>
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
