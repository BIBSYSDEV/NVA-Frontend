import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Form, Formik, FormikProps } from 'formik';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import OrcidLogo from '../../../../resources/images/orcid_logo.svg';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { isErrorStatus, isSuccessStatus, ORCID_BASE_URL } from '../../../../utils/constants';
import { convertToFlatCristinUser, filterActiveAffiliations } from '../../../../utils/user-helpers';
import { CristinUser, InstitutionUser, RoleName } from '../../../../types/user.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { RoleApiPath } from '../../../../api/apiPaths';
import { UserRolesSelector } from '../UserRolesSelector';
import { authenticatedApiRequest } from '../../../../api/apiRequest';
import { setNotification } from '../../../../redux/notificationSlice';

interface FormData {
  roles: RoleName[];
}

interface PersonTableRowProps {
  cristinPerson: CristinUser;
  topOrgCristinIdentifier: string;
}

export const PersonTableRow = ({ cristinPerson, topOrgCristinIdentifier }: PersonTableRowProps) => {
  const { t } = useTranslation('basicData');
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => setOpenDialog(!openDialog);

  const { cristinIdentifier, firstName, lastName, affiliations, orcid } = convertToFlatCristinUser(cristinPerson);
  const activeEmployments = filterActiveAffiliations(affiliations);
  const orcidUrl = orcid ? `${ORCID_BASE_URL}/${orcid}` : '';

  const username = `${cristinIdentifier}@${topOrgCristinIdentifier}`;
  const [user, isLoadingUser] = useFetch<InstitutionUser>({
    url: openDialog ? `${RoleApiPath.Users}/${username}` : '',
    withAuthentication: true,
  });

  const initialValues: FormData = { roles: user ? user.roles.map((role) => role.rolename) : [RoleName.Creator] };

  const onSubmit = async (values: FormData) => {
    if (user) {
      // Update existing user
      const newUser: InstitutionUser = {
        ...user,
        roles: values.roles.map((role) => ({ type: 'Role', rolename: role })),
      };

      const updateUserResponse = await authenticatedApiRequest({
        url: `${RoleApiPath.Users}/${username}`,
        method: 'PUT',
        data: newUser,
      });
      if (isSuccessStatus(updateUserResponse.status)) {
        toggleDialog();
        dispatch(setNotification({ message: t('feedback:success.update_institution_user'), variant: 'success' }));
      } else if (isErrorStatus(updateUserResponse.status)) {
        dispatch(setNotification({ message: t('feedback:error.update_institution_user'), variant: 'error' }));
      }
    } else {
      // TODO: Create user with roles (NP-9152)
    }
  };

  return (
    <TableRow>
      <TableCell>{cristinIdentifier}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography>
            {firstName} {lastName}
          </Typography>
          {orcidUrl && (
            <Tooltip title={t<string>('common:orcid_profile')}>
              <IconButton size="small" href={orcidUrl} target="_blank">
                <img src={OrcidLogo} height="20" alt="orcid" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Box component="ul" sx={{ p: 0 }}>
          {activeEmployments.map((employment, index) => (
            <Box key={`${employment.organization}-${index}`} component="li" sx={{ display: 'flex' }}>
              <AffiliationHierarchy unitUri={employment.organization} commaSeparated />
            </Box>
          ))}
        </Box>
      </TableCell>
      <TableCell>
        <Tooltip title={t('common:edit')}>
          <IconButton onClick={toggleDialog}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
      <Dialog open={openDialog} onClose={toggleDialog} maxWidth="md" fullWidth transitionDuration={{ exit: 0 }}>
        <DialogTitle>{t('person_register.edit_person')}</DialogTitle>
        <Formik initialValues={initialValues} enableReinitialize onSubmit={onSubmit}>
          {({ values, isSubmitting, setFieldValue }: FormikProps<FormData>) => (
            <Form>
              <DialogContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <TextField variant="filled" disabled value={firstName} label={t('common:first_name')} />
                    <TextField variant="filled" disabled value={lastName} label={t('common:last_name')} />
                  </Box>
                  <Divider flexItem orientation="vertical" />
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {isLoadingUser ? (
                      <CircularProgress />
                    ) : user ? (
                      <UserRolesSelector
                        selectedRoles={values.roles}
                        updateRoles={(newRoles) => setFieldValue('roles', newRoles)}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <Typography>{t('person_register.user_does_not_exist')}</Typography>
                    )}
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={toggleDialog}>{t('common:cancel')}</Button>
                <LoadingButton loading={isSubmitting} disabled={!user} variant="contained" type="submit">
                  {t('common:save')}
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </TableRow>
  );
};
