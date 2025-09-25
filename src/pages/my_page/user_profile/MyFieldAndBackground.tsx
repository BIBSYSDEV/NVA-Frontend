import { Autocomplete, Box, Button, Chip, TextField, Typography } from '@mui/material';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  defaultOrganizationSearchSize,
  fetchPerson,
  searchForKeywords,
  updateCristinPerson,
} from '../../../api/cristinApi';
import {
  AutocompleteListboxWithExpansion,
  AutocompleteListboxWithExpansionProps,
} from '../../../components/AutocompleteListboxWithExpansion';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { HeadTitle } from '../../../components/HeadTitle';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { Keywords, KeywordsOld } from '../../../types/keywords.types';
import { FlatCristinPerson } from '../../../types/user.types';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getLanguageString } from '../../../utils/translation-helpers';
import { ProfileBox } from './styles';

type PersonBackgroundFormData = Pick<FlatCristinPerson, 'background' | 'keywords'>;

export const MyFieldAndBackground = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector((store: RootState) => store.user);
  const personId = user?.cristinId ?? '';

  const [keywordSearchTerm, setKeywordSearchTerm] = useState('');
  const debouncedKeywordsSearchTerm = useDebounce(keywordSearchTerm);

  const personQuery = useQuery({
    enabled: !!personId,
    queryKey: ['person', personId],
    queryFn: () => fetchPerson(personId),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const person = personQuery.data;
  const personBackground = person?.background ?? {};
  const personKeywords = person?.keywords ?? [];

  const [searchSize, setSearchSize] = useState(defaultOrganizationSearchSize);
  const keywordsQuery = useQuery({
    queryKey: ['keywords', debouncedKeywordsSearchTerm, searchSize],
    queryFn: () => searchForKeywords(searchSize, 1, debouncedKeywordsSearchTerm),
    meta: { errorMessage: t('feedback.error.get_keywords') },
    placeholderData: keepPreviousData,
  });

  const keywordsResult = keywordsQuery.data?.hits ?? [];

  const initialValues: PersonBackgroundFormData = {
    background: {
      no: personBackground.no ?? '',
      en: personBackground.en ?? '',
    },
    keywords: personKeywords.map((keyword) => ({
      type: 'Keyword',
      id: '',
      identifier: keyword.type,
      labels: keyword.label,
    })),
  };

  const updatePerson = useMutation({
    mutationFn: async (values: PersonBackgroundFormData) => {
      if (personId) {
        const keywords = values.keywords as Keywords[];
        const mappedKeywords: KeywordsOld[] = keywords.map((keyword) => ({
          type: keyword.identifier,
          label: keyword.labels,
        }));
        const payload: PersonBackgroundFormData = {
          background: {
            no: values.background.no === '' ? null : values.background.no,
            en: values.background.en === '' ? null : values.background.en,
          },
          keywords: mappedKeywords,
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
    <Box sx={{ bgcolor: 'secondary.main' }}>
      <HeadTitle>{t('my_page.my_profile.field_and_background.field_and_background')}</HeadTitle>

      <Formik initialValues={initialValues} onSubmit={(values) => updatePerson.mutate(values)} enableReinitialize>
        {({ isSubmitting, dirty, setFieldValue, resetForm }: FormikProps<PersonBackgroundFormData>) => (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', m: '1rem', maxWidth: '60rem', gap: '1rem' }}>
              <Typography variant="h1">{t('my_page.my_profile.field_and_background.field_and_background')}</Typography>
              <ProfileBox>
                <Typography variant="h2" gutterBottom>
                  {t('my_page.my_profile.field_and_background.field')}
                </Typography>
                <Typography sx={{ mb: '1rem' }}>{t('my_page.my_profile.field_and_background.field_text')}</Typography>
                <Field name={'keywords'}>
                  {({ field }: FieldProps<Keywords[]>) => (
                    <Autocomplete
                      {...field}
                      loading={keywordsQuery.isFetching}
                      value={field.value ?? []}
                      multiple
                      options={keywordsResult}
                      isOptionEqualToValue={(option, value) => option.identifier === value.identifier}
                      getOptionLabel={(option) => getLanguageString(option.labels)}
                      getOptionDisabled={(option) =>
                        field.value.some((keyword) => keyword.identifier === option.identifier)
                      }
                      renderOption={({ key, ...props }, option) => (
                        <li {...props} key={option.identifier}>
                          <Typography>{getLanguageString(option.labels)}</Typography>
                        </li>
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.identifier}
                            label={getLanguageString(option.labels)}
                          />
                        ))
                      }
                      noOptionsText={t('common.no_search_hits')}
                      filterOptions={(options) => options}
                      autoComplete
                      onInputChange={(_, newInputValue, reason) => {
                        if (reason !== 'reset') {
                          setKeywordSearchTerm(newInputValue);
                        }
                      }}
                      onChange={(_, value) => {
                        setFieldValue(field.name, value);
                      }}
                      renderInput={(params) => (
                        <AutocompleteTextField
                          {...params}
                          isLoading={keywordsQuery.isFetching}
                          label={t('registration.description.keywords')}
                        />
                      )}
                      slotProps={{
                        listbox: {
                          component: AutocompleteListboxWithExpansion,
                          ...({
                            hasMoreHits: !!keywordsQuery.data?.size && keywordsQuery.data.size > searchSize,
                            onShowMoreHits: () => setSearchSize(searchSize + defaultOrganizationSearchSize),
                            isLoadingMoreHits: keywordsQuery.isFetching && searchSize > keywordsResult.length,
                          } satisfies AutocompleteListboxWithExpansionProps),
                        },
                      }}
                    />
                  )}
                </Field>
                <Typography variant="body1" sx={{ my: '0.5rem' }}>
                  {t('my_page.my_profile.field_and_background.keywords_search_text')}
                </Typography>
              </ProfileBox>
              <ProfileBox>
                <Typography variant="h2" gutterBottom>
                  {t('my_page.my_profile.background')}
                </Typography>
                <Trans
                  i18nKey="my_page.my_profile.background_description"
                  components={[<Typography key="1" gutterBottom />]}
                />
                <Field name={'background.no'}>
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      label={t('my_page.my_profile.background_no')}
                      variant="filled"
                      multiline
                      rows="3"
                      placeholder={t('my_page.my_profile.field_and_background.background_placeholder')}
                      helperText={`${field.value.length}/${maxMessageLength}`}
                      sx={{ my: '1rem' }}
                      slotProps={{
                        htmlInput: { maxLength: maxMessageLength },
                        formHelperText: { sx: { textAlign: 'end' } },
                      }}
                    />
                  )}
                </Field>
                <Field name={'background.en'}>
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      label={t('my_page.my_profile.background_en')}
                      variant="filled"
                      multiline
                      rows="3"
                      placeholder={t('my_page.my_profile.field_and_background.background_placeholder')}
                      helperText={`${field.value.length}/${maxMessageLength}`}
                      slotProps={{
                        htmlInput: { maxLength: maxMessageLength },
                        formHelperText: { sx: { textAlign: 'end' } },
                      }}
                    />
                  )}
                </Field>
              </ProfileBox>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                my: '1rem',
                gap: '1rem',
              }}>
              <Button
                onClick={() => {
                  resetForm();
                }}>
                {t('common.cancel')}
              </Button>
              <Button loading={isSubmitting} disabled={!dirty} variant="contained" type="submit">
                {t('common.save')}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
