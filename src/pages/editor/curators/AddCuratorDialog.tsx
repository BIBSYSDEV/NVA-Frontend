import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchUser } from '../../../api/roleApi';
import { fetchEmployees } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { RootState } from '../../../redux/store';
import { Organization } from '../../../types/organization.types';
import { CristinPerson, InstitutionUser } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getAllChildOrganizations } from '../../../utils/institutions-helpers';
import { getFullCristinName, getUsername } from '../../../utils/user-helpers';
import { AddCuratorForm } from './AddCuratorForm';
import { OrganizationCuratorsAccordionProps } from './OrganizationCuratorsAccordion';

interface AddCuratorDialogProps
  extends Pick<DialogProps, 'open'>,
    Pick<OrganizationCuratorsAccordionProps, 'refetchCurators' | 'parentOrganizationIds'> {
  onClose: () => void;
  currentOrganization: Organization;
}

export const AddCuratorDialog = ({
  onClose,
  open,
  currentOrganization,
  refetchCurators,
  parentOrganizationIds,
}: AddCuratorDialogProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const topOrgCristinId = user?.topOrgCristinId ?? '';
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const [selectedPerson, setSelectedPerson] = useState<CristinPerson | null>(null);
  const [userInitialValues, setUserInitialValues] = useState<InstitutionUser | null>(null);

  const closeDialog = () => {
    setSearchQuery('');
    setSelectedPerson(null);
    setUserInitialValues(null);
    onClose();
  };

  // if (open) {
  //   console.log(parentOrganizationIds.length);
  // }

  const employeeSearchQuery = useQuery({
    enabled: open && !!topOrgCristinId && !!debouncedSearchQuery && debouncedSearchQuery === searchQuery,
    queryKey: ['employees', topOrgCristinId, 20, 1, debouncedSearchQuery],
    queryFn: ({ signal }) => fetchEmployees(topOrgCristinId, 20, 1, debouncedSearchQuery, signal),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  const username = getUsername(selectedPerson, topOrgCristinId);

  const userQuery = useQuery({
    enabled: open && !!selectedPerson && !!username,
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    meta: { errorMessage: false }, // No error message, since a Cristin Person will lack User if they have not logged in yet
    retry: false,
    cacheTime: 0, // Disable caching since this user in many cases will be changed, and the cached data then will be outdated
  });

  useEffect(() => {
    const currentUser = userQuery.data;
    if (currentUser) {
      let viewingScope = currentUser.viewingScope.includedUnits;

      const newOrganizationId = !viewingScope.includes(currentOrganization.id) ? currentOrganization.id : null;
      if (newOrganizationId) {
        // Remove organizations conflicting with the new organization
        const childOrganizationIds = getAllChildOrganizations(currentOrganization.hasPart).map((unit) => unit.id);
        viewingScope = viewingScope.filter(
          (id) => !parentOrganizationIds.includes(id) && !childOrganizationIds.includes(id)
        );

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
  }, [currentOrganization, parentOrganizationIds, userQuery.data]);

  return (
    <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>
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
              setUserInitialValues(null);
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
              data-testid={dataTestId.editor.curatorsSearchForPersonField}
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
              <CircularProgress aria-label={t('editor.curators.add_curator')} />
            ) : userQuery.data && userInitialValues ? (
              <AddCuratorForm
                closeDialog={closeDialog}
                initialValues={userInitialValues}
                currentViewingScope={userQuery.data.viewingScope.includedUnits}
                refetchCurators={refetchCurators}
              />
            ) : (
              <>
                {/* TODO: Support creation of new User */}
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
          <Button data-testid={dataTestId.confirmDialog.cancelButton} onClick={closeDialog}>
            {t('common.cancel')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
