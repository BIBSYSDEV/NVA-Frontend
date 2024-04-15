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
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getAllChildOrganizations, getOrganizationHierarchy } from '../../../utils/institutions-helpers';
import { getFullCristinName, getValueByKey } from '../../../utils/user-helpers';
import { AddCuratorForm } from './AddCuratorForm';
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
  const [userInitialValues, setUserInitialValues] = useState<InstitutionUser | null>(null);

  const closeDialog = () => {
    setSearchQuery('');
    setSelectedPerson(null);
    setUserInitialValues(null);
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

      // Remove organizations conflicting with the new organization
      const parentOrganizationIds = getOrganizationHierarchy(currentOrganization)
        .filter((org) => org.id !== currentOrganization.id)
        .map((org) => org.id);
      const childOrganizationIds = getAllChildOrganizations(currentOrganization.hasPart).map((unit) => unit.id);
      viewingScope = viewingScope.filter(
        (id) => !parentOrganizationIds.includes(id) && !childOrganizationIds.includes(id)
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
              <AddCuratorForm
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
