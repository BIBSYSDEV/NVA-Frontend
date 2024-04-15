import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormGroup,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikProps } from 'formik';
import { t } from 'i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, updateUser } from '../../../api/roleApi';
import { fetchEmployees } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { RoleSelectBox } from '../../../components/RoleSelectBox';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { Organization } from '../../../types/organization.types';
import { CristinPerson, InstitutionUser, RoleName } from '../../../types/user.types';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getAllChildOrganizations, getOrganizationHierarchy } from '../../../utils/institutions-helpers';
import { getFullCristinName, getValueByKey } from '../../../utils/user-helpers';
import { ViewingScopeChip } from '../../basic_data/institution_admin/edit_user/ViewingScopeChip';
import { OrganizationCuratorsAccordionProps } from './OrganizationCuratorsAccordion';

interface AddCuratorDialogProps
  extends Pick<DialogProps, 'open'>,
    Pick<OrganizationCuratorsAccordionProps, 'refetchCurators'> {
  onClose: () => void;
  currentOrganization: Organization;
}

export const AddCuratorDialog = ({ onClose, open, currentOrganization, refetchCurators }: AddCuratorDialogProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const [selectedPerson, setSelectedPerson] = useState<CristinPerson | null>(null);
  const [userInitialValues, setUserInitialValues] = useState<InstitutionUser>();

  const closeDialog = () => {
    setSearchQuery('');
    setSelectedPerson(null);
    setUserInitialValues(undefined);
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
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: false }, // No error message, since a Cristin Person will lack User if they have not logged in yet
    retry: false,
  });

  useEffect(() => {
    const currentUser = userQuery.data;
    if (currentUser) {
      let viewingScope = [...currentUser.viewingScope.includedUnits];

      const newOrganizationId = !viewingScope.includes(currentOrganization.id) ? currentOrganization.id : null;
      const parentOrganizations = getOrganizationHierarchy(currentOrganization)
        .filter((org) => org.id !== currentOrganization.id)
        .map((org) => org.id);
      const childrenOrganizations = getAllChildOrganizations(currentOrganization.hasPart).map((unit) => unit.id);

      viewingScope = viewingScope.filter(
        (id) => !parentOrganizations.includes(id) && !childrenOrganizations.includes(id)
      );

      if (newOrganizationId) {
        viewingScope.push(newOrganizationId);
      }

      const initialValues: InstitutionUser = {
        ...currentUser,
        viewingScope: {
          ...currentUser.viewingScope,
          includedUnits: viewingScope,
        },
      };

      setUserInitialValues(initialValues);
    }
  }, [currentOrganization, userQuery.data]);

  return (
    <Dialog open={open} onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>{t('editor.curators.add_curator')}</DialogTitle>

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
              setUserInitialValues(undefined);
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
          loading={employeeSearchQuery.isFetching}
          sx={{ mb: '1rem' }}
          renderInput={(params) => (
            <AutocompleteTextField
              // data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeSearchField}
              {...params}
              label={t('common.person')}
              isLoading={employeeSearchQuery.isFetching}
              placeholder={t('common.search')}
              showSearchIcon
            />
          )}
        />

        {selectedPerson && (
          <>
            {userQuery.isLoading || (userQuery.data && !userInitialValues) ? (
              <CircularProgress />
            ) : userQuery.data && userInitialValues ? (
              <UserForm
                closeDialog={closeDialog}
                initialValues={userInitialValues}
                currentUser={userQuery.data}
                refetchCurators={refetchCurators}
              />
            ) : (
              <>
                <Typography>
                  Brukeren du ønsker å legge til som kurator må logge inn i løsningnen for å få tildelt en bruker før du
                  kan gi dem kuratortilgang.
                </Typography>
                <Typography>
                  Be {getFullCristinName(selectedPerson.names)} om å logge inn i NVA før du prøver igjen.
                </Typography>
              </>
            )}
          </>
        )}
      </DialogContent>

      {(!selectedPerson || !userQuery.data) && (
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={closeDialog}>{t('common.cancel')}</Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

interface UserFormProps extends Pick<OrganizationCuratorsAccordionProps, 'refetchCurators'> {
  closeDialog: () => void;
  currentUser: InstitutionUser;
  initialValues: InstitutionUser;
}

const UserForm = ({ closeDialog, currentUser, initialValues, refetchCurators }: UserFormProps) => {
  const dispatch = useDispatch();

  const currentViewingScope = currentUser.viewingScope.includedUnits;
  const newViewingScope = initialValues.viewingScope.includedUnits;

  const allViewingScopes = Array.from(new Set([...currentViewingScope, ...newViewingScope]));

  const userMutation = useMutation({
    mutationFn: (user: InstitutionUser) => updateUser(user.username, user),
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' })),
    onSuccess: async () => {
      await refetchCurators();
      dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' }));
      closeDialog();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={async (values) => await userMutation.mutateAsync(values)}>
      {({ values, setFieldValue, dirty, isSubmitting }: FormikProps<InstitutionUser>) => (
        <Form noValidate>
          <Typography variant="h3" gutterBottom>
            {t('editor.curators.area_of_responsibility')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'start' }}>
            {allViewingScopes.map((organizationId) => {
              const isNewUnit =
                newViewingScope.includes(organizationId) && !currentViewingScope.includes(organizationId);
              const isRemovedUnit =
                !newViewingScope.includes(organizationId) && currentViewingScope.includes(organizationId);

              return (
                <Box key={organizationId} sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <ViewingScopeChip key={organizationId} organizationId={organizationId} disabled={isSubmitting} />
                  {isNewUnit && <Typography>(NY)</Typography>}
                  {isRemovedUnit && <Typography>(FJERNES)</Typography>}
                </Box>
              );
            })}
          </Box>

          <Typography variant="h3" sx={{ mt: '1rem' }} gutterBottom>
            {t('my_page.my_profile.heading.roles')}
          </Typography>
          <FormControl
            component="fieldset"
            onChange={(event: ChangeEvent<any>) => {
              const role = event.target.value as RoleName;

              const isRemovingRole = values.roles.some((thisRole) => thisRole.rolename === role);

              let newRoles = isRemovingRole
                ? values.roles.filter((selectedRole) => selectedRole.rolename !== role)
                : [...values.roles, { type: 'Role', rolename: role }];

              if (isRemovingRole) {
                // Remove roles that depend on the removed role
                if (role === RoleName.PublishingCurator) {
                  newRoles = newRoles.filter(
                    (role) =>
                      role.rolename !== RoleName.CuratorThesis && role.rolename !== RoleName.CuratorThesisEmbargo
                  );
                } else if (role === RoleName.CuratorThesis) {
                  newRoles = newRoles.filter((role) => role.rolename !== RoleName.CuratorThesisEmbargo);
                }
              }

              setFieldValue('roles', newRoles);
            }}
            // data-testid={dataTestId.basicData.personAdmin.roleSelector}
          >
            <FormGroup sx={{ gap: '0.25rem', ml: '0.5rem' }}>
              <RoleSelectBox
                sx={{ bgcolor: 'generalSupportCase.main' }}
                label={t('my_page.roles.support_curator')}
                description={t('my_page.roles.support_curator_description')}
                disabled={isSubmitting}
                checked={values.roles.some((role) => role.rolename === RoleName.SupportCurator)}
                value={RoleName.SupportCurator}
              />
              <RoleSelectBox
                sx={{ bgcolor: 'publishingRequest.main' }}
                label={t('my_page.roles.publishing_curator')}
                description={t('my_page.roles.publishing_curator_description')}
                disabled={isSubmitting}
                checked={values.roles.some((role) => role.rolename === RoleName.PublishingCurator)}
                value={RoleName.PublishingCurator}
              />
              <RoleSelectBox
                sx={{ bgcolor: 'publishingRequest.main', ml: '1rem' }}
                label={t('editor.curators.role.Curator-thesis')}
                disabled={isSubmitting || !values.roles.some((role) => role.rolename === RoleName.PublishingCurator)}
                checked={values.roles.some((role) => role.rolename === RoleName.CuratorThesis)}
                value={RoleName.CuratorThesis}
              />
              <RoleSelectBox
                sx={{ bgcolor: 'publishingRequest.main', ml: '2rem' }}
                label={t('editor.curators.role.Curator-thesis-embargo')}
                disabled={isSubmitting || !values.roles.some((role) => role.rolename === RoleName.CuratorThesis)}
                checked={values.roles.some((role) => role.rolename === RoleName.CuratorThesisEmbargo)}
                value={RoleName.CuratorThesisEmbargo}
              />
              <RoleSelectBox
                sx={{ bgcolor: 'doiRequest.main' }}
                label={t('my_page.roles.doi_curator')}
                description={t('my_page.roles.doi_curator_description')}
                disabled={isSubmitting}
                checked={values.roles.some((role) => role.rolename === RoleName.DoiCurator)}
                value={RoleName.DoiCurator}
              />
              <RoleSelectBox
                sx={{ bgcolor: 'nvi.main' }}
                label={t('my_page.roles.nvi_curator')}
                description={t('my_page.roles.nvi_curator_description')}
                disabled={isSubmitting}
                checked={values.roles.some((role) => role.rolename === RoleName.NviCurator)}
                value={RoleName.NviCurator}
              />
            </FormGroup>
          </FormControl>
          <DialogActions sx={{ justifyContent: 'center', p: 0 }}>
            <Button onClick={closeDialog}>{t('common.cancel')}</Button>
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              disabled={!dirty && newViewingScope.at(-1) === currentViewingScope.at(-1)}>
              {t('common.add')}
            </LoadingButton>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
