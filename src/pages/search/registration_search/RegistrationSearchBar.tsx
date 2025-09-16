import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import { Box, Button, IconButton } from '@mui/material';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  createSearchConfigFromSearchParams,
  dataSearchFieldAttributeName,
  isValidIsbn,
  PropertySearch,
  removeSearchParamValue,
  syncParamsWithSearchFields,
} from '../../../utils/searchHelpers';
import { ExportResultsButton } from '../ExportResultsButton';
import { SearchTextField } from '../SearchTextField';
import { SearchTypeField } from '../SearchTypeField';
import { AdvancedSearchRow } from './filters/AdvancedSearchRow';

const facetParams: string[] = [
  ResultParam.Category,
  ResultParam.Contributor,
  ResultParam.Journal,
  ResultParam.Publisher,
  ResultParam.Files,
  ResultParam.FundingSource,
  ResultParam.ScientificReportPeriodSinceParam,
  ResultParam.ScientificReportPeriodBeforeParam,
  ResultParam.Series,
  ResultParam.TopLevelOrganization,
];

interface SelectedFacet {
  param: string;
  value: string;
}

interface SearchTermProperties {
  searchTerm: string;
  properties: SearchTermProperty[];
}

interface SearchTermProperty {
  fieldName: ResultParam | '';
  value: string;
}

export const RegistrationSearchBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const selectedFacets: SelectedFacet[] = [];
  searchParams.forEach((value, param) => {
    if (facetParams.includes(param)) {
      const values = value.split(',');
      values.forEach((thisValue) => {
        selectedFacets.push({ param, value: thisValue });
      });
    }
  });

  const initialSearchParams: SearchTermProperties = createSearchConfigFromSearchParams(searchParams);

  function processSearchParamProperties(values: SearchTermProperties, searchParam: ResultParam) {
    const paramValues =
      values.properties
        ?.filter((property) => property.fieldName === searchParam && property.value)
        .map((property) => property.value) ?? [];
    if (paramValues.length > 0) {
      searchParams.set(searchParam, paramValues.join(','));
    } else {
      searchParams.delete(searchParam);
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialSearchParams}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values: SearchTermProperties) => {
        searchParams.delete(ResultParam.From);

        if (values.searchTerm) {
          if (isValidIsbn(values.searchTerm)) {
            searchParams.delete(ResultParam.Query);
            values.properties.push({ fieldName: ResultParam.Isbn, value: values.searchTerm });
            values.searchTerm = '';
          } else {
            searchParams.set(ResultParam.Query, values.searchTerm);
          }
        } else {
          searchParams.delete(ResultParam.Query);
        }

        processSearchParamProperties(values, ResultParam.ContributorName);
        processSearchParamProperties(values, ResultParam.Title);
        processSearchParamProperties(values, ResultParam.Abstract);
        processSearchParamProperties(values, ResultParam.Tags);
        processSearchParamProperties(values, ResultParam.Identifier);
        processSearchParamProperties(values, ResultParam.Isbn);
        processSearchParamProperties(values, ResultParam.Issn);
        processSearchParamProperties(values, ResultParam.Doi);
        processSearchParamProperties(values, ResultParam.Handle);
        processSearchParamProperties(values, ResultParam.FundingIdentifier);
        processSearchParamProperties(values, ResultParam.Course);
        processSearchParamProperties(values, ResultParam.CristinIdentifier);

        navigate({ search: searchParams.toString() });
      }}>
      {({ values, submitForm }) => {
        const showExtraFilterRow = values.properties.length > 0;

        return (
          <Box
            component={Form}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'auto 1fr auto' },
              gridTemplateAreas: {
                xs: showExtraFilterRow
                  ? "'typeSearch' 'searchbar' 'buttonRowTop' 'filter' 'buttonRowBottom'"
                  : "'typeSearch' 'searchbar' 'buttonRowTop'",
                md: showExtraFilterRow
                  ? "'typeSearch searchbar buttonRowTop' 'filter filter buttonRowBottom'"
                  : "'typeSearch searchbar buttonRowTop'",
              },
              gap: '0.75rem 0.5rem',
            }}>
            <SearchTypeField sx={{ gridArea: 'typeSearch' }} />
            <Field name="searchTerm" gridArea="searchbar">
              {({ field }: FieldProps<string>) => (
                <SearchTextField
                  {...field}
                  slotProps={{ htmlInput: { [dataSearchFieldAttributeName]: ResultParam.Query } }}
                  placeholder={t('search.search_placeholder')}
                  clearValue={() => {
                    field.onChange({ target: { value: '', id: field.name } });
                    submitForm();
                  }}
                />
              )}
            </Field>

            <Box gridArea="buttonRowTop">
              <FilterButton />
              <ExportResultsButton searchParams={searchParams} />
            </Box>

            {showExtraFilterRow && (
              <FieldArray name="properties">
                {({ push, remove }: FieldArrayRenderProps) => (
                  <>
                    <Box gridArea="filter" sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {values.properties.map((property, index) => (
                        <AdvancedSearchRow
                          key={index}
                          queryParam={property.fieldName}
                          removeFilter={() => {
                            remove(index);
                            const valueToRemove =
                              typeof property.value === 'string' ? property.value : property.value[0];
                            const syncedParams = syncParamsWithSearchFields(searchParams);
                            const newParams = removeSearchParamValue(syncedParams, property.fieldName, valueToRemove);
                            newParams.delete(ResultParam.From);
                            navigate({ search: newParams.toString() });
                          }}
                          baseFieldName={`properties[${index}]`}
                        />
                      ))}
                    </Box>
                    <Box gridArea="buttonRowBottom" sx={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <IconButton
                        sx={{ borderRadius: '4px', minWidth: '36px', minHeight: '36px' }}
                        size="small"
                        title={t('common.add_custom', { name: t('common.filter').toLocaleLowerCase() })}
                        data-testid={dataTestId.startPage.advancedSearch.addFilterButton}
                        onClick={() => {
                          const newPropertyFilter: PropertySearch = {
                            fieldName: '',
                            value: '',
                          };
                          push(newPropertyFilter);
                        }}>
                        <AddIcon />
                      </IconButton>
                      <Button
                        color="secondary"
                        variant="contained"
                        type="submit"
                        data-testid={dataTestId.startPage.advancedSearch.searchButton}>
                        {t('common.search')}
                      </Button>
                    </Box>
                  </>
                )}
              </FieldArray>
            )}
          </Box>
        );
      }}
    </Formik>
  );
};

const FilterButton = () => {
  const { t } = useTranslation();
  const { values, setFieldValue, submitForm } = useFormikContext<SearchTermProperties>();

  return (
    <Button
      sx={{ mr: '0.5rem', color: 'primary.main', bgcolor: 'secondary.light' }}
      data-testid={dataTestId.startPage.advancedSearch.activateFilterButton}
      startIcon={<FilterAltIcon />}
      onClick={() => {
        const newProp: SearchTermProperty = { fieldName: '', value: '' };
        if (values.properties.length === 0) {
          setFieldValue('properties', [newProp]);
        } else {
          setFieldValue('properties', []);
          submitForm();
        }
      }}
      variant={values.properties.length ? 'contained' : 'outlined'}>
      {t('common.filter')}
    </Button>
  );
};
