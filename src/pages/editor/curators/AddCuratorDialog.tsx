import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikProps, useFormikContext } from 'formik';
import { t } from 'i18next';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchUser } from '../../../api/roleApi';
import { fetchEmployees } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { RootState } from '../../../redux/store';
import { CristinPerson, RoleName } from '../../../types/user.types';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getFullCristinName, getValueByKey } from '../../../utils/user-helpers';
import { AreaOfResponsibility } from '../../basic_data/institution_admin/edit_user/AreaOfResponsibility';

interface AddCuratorDialogProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
}

export const AddCuratorDialog = ({ onClose, open }: AddCuratorDialogProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const [selectedPerson, setSelectedPerson] = useState<CristinPerson | null>(null);

  const closeDialog = () => {
    setSearchQuery('');
    setSelectedPerson(null);
    onClose();
  };

  const employeeSearchQuery = useQuery({
    enabled: open && !!topOrgCristinId && !!debouncedSearchQuery && debouncedSearchQuery === searchQuery,
    queryKey: ['employees', topOrgCristinId, 20, 1, debouncedSearchQuery],
    queryFn: ({ signal }) => fetchEmployees(topOrgCristinId, 20, 1, debouncedSearchQuery, signal),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  const personCristinIdentifier = getValueByKey('CristinIdentifier', selectedPerson?.identifiers);
  const topOrgCristinIdentifier = getIdentifierFromId(topOrgCristinId);
  const username =
    personCristinIdentifier && topOrgCristinIdentifier ? `${personCristinIdentifier}@${topOrgCristinIdentifier}` : '';

  const userQuery = useQuery({
    enabled: open && !!selectedPerson && !!username,
    queryKey: [username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: false }, // No error message, since a Cristin Person will lack User if they have not logged in yet
    retry: false,
  });

  const isLoading = employeeSearchQuery.isFetching;

  return (
    <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>{t('editor.curators.add_curator')}</DialogTitle>
      <Formik
        initialValues={userQuery.data ?? {}}
        enableReinitialize
        onSubmit={(values) => console.log('submit', values)}>
        {({ values, setFieldValue, dirty }: FormikProps<any>) => (
          <Form noValidate>
            <DialogContent>
              <Autocomplete
                options={employeeSearchQuery.data?.hits ?? []}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {getFullCristinName(option.names)}
                  </li>
                )}
                onInputChange={(_, value, reason) => {
                  if (reason === 'clear' || reason === 'reset') {
                    setSearchQuery('');
                    setSelectedPerson(null);
                  } else {
                    setSearchQuery(value);
                  }
                }}
                onChange={async (_, value) => {
                  setSearchQuery('');
                  setSelectedPerson(value);
                }}
                getOptionLabel={(option) => getFullCristinName(option.names)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                loading={isLoading}
                sx={{ mb: '1rem' }}
                renderInput={(params) => (
                  <AutocompleteTextField
                    // data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeSearchField}
                    {...params}
                    label={t('common.person')}
                    isLoading={isLoading}
                    placeholder={t('common.search')}
                    showSearchIcon
                  />
                )}
              />

              {selectedPerson && (
                <>
                  {userQuery.isLoading ? (
                    <CircularProgress />
                  ) : userQuery.data && values ? (
                    <UserForm />
                  ) : (
                    <>
                      <Typography>
                        Brukeren du ønsker å legge til som kurator må logge inn i løsningnen for å få tildelt en bruker
                        før du kan gi dem kuratortilgang.
                      </Typography>
                      <Typography>
                        Be {getFullCristinName(selectedPerson.names)} om å logge inn i NVA før du prøver igjen.
                      </Typography>
                    </>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button onClick={closeDialog}>{t('common.cancel')}</Button>
              <Button type="submit" variant="contained" disabled={Object.keys(values).length === 0 || !dirty}>
                {t('common.add')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

const UserForm = () => {
  const { setFieldValue, values } = useFormikContext<any>();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        {t('editor.curators.area_of_responsibility')}
      </Typography>
      <AreaOfResponsibility
        viewingScopes={values.viewingScope?.includedUnits ?? []}
        updateViewingScopes={(newViewingScopes) => setFieldValue('viewingScope.includedUnits', newViewingScopes)}
      />
      <Typography variant="h3" sx={{ mt: '1rem' }}>
        {t('my_page.my_profile.heading.roles')}
      </Typography>
      <FormControl
        component="fieldset"
        onChange={(event: ChangeEvent<any>) => {
          const role = event.target.value as RoleName;
          const roleExists = values.roles?.some((r: any) => r.rolename === role);

          const newRoles = roleExists
            ? values.roles.filter((selectedRole: any) => selectedRole.rolename !== role)
            : [...values.roles, { type: 'Role', rolename: role }];
          console.log(newRoles);

          setFieldValue('roles', newRoles);
        }}
        // data-testid={dataTestId.basicData.personAdmin.roleSelector}
      >
        <FormGroup sx={{ gap: '0.5rem' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.roles?.some((r: any) => r.rolename === RoleName.PublishingCurator)}
                value={RoleName.PublishingCurator}
              />
            }
            label={t('my_page.roles.publishing_curator')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.roles?.some((r: any) => r.rolename === RoleName.CuratorThesis)}
                value={RoleName.CuratorThesis}
              />
            }
            label={'Studentoppgave'}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.roles?.some((r: any) => r.rolename === RoleName.CuratorThesisEmbargo)}
                value={RoleName.CuratorThesisEmbargo}
              />
            }
            label={'Embargo'}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.roles?.some((r: any) => r.rolename === RoleName.DoiCurator)}
                value={RoleName.DoiCurator}
              />
            }
            label={t('my_page.roles.doi_curator')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.roles?.some((r: any) => r.rolename === RoleName.SupportCurator)}
                value={RoleName.SupportCurator}
              />
            }
            label={t('my_page.roles.support_curator')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.roles?.some((r: any) => r.rolename === RoleName.NviCurator)}
                value={RoleName.NviCurator}
              />
            }
            label={t('my_page.roles.nvi_curator')}
          />
        </FormGroup>
      </FormControl>
    </>
  );
};
