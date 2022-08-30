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
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Form, Formik, FormikProps } from 'formik';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import OrcidLogo from '../../../../resources/images/orcid_logo.svg';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { isErrorStatus, isSuccessStatus, ORCID_BASE_URL } from '../../../../utils/constants';
import {
  convertToFlatCristinPerson,
  filterActiveAffiliations,
  getMaskedNationalIdentityNumber,
} from '../../../../utils/user-helpers';
import { CristinPerson, CristinPersonAffiliation, InstitutionUser, RoleName } from '../../../../types/user.types';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { RoleApiPath } from '../../../../api/apiPaths';
import { UserRolesSelector } from '../UserRolesSelector';
import { authenticatedApiRequest } from '../../../../api/apiRequest';
import { setNotification } from '../../../../redux/notificationSlice';
import { createUser } from '../../../../api/roleApi';

interface FormData {
  roles: RoleName[];
}

interface PersonTableRowProps {
  cristinPerson: CristinPerson;
  topOrgCristinIdentifier: string;
  customerId: string;
}

export const PersonTableRow = ({ cristinPerson, topOrgCristinIdentifier, customerId }: PersonTableRowProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => setOpenDialog(!openDialog);

  const { cristinIdentifier, firstName, lastName, affiliations, orcid, nationalId } =
    convertToFlatCristinPerson(cristinPerson);
  const activeEmployments = filterActiveAffiliations(affiliations);
  const orcidUrl = orcid ? `${ORCID_BASE_URL}/${orcid}` : '';

  const username = `${cristinIdentifier}@${topOrgCristinIdentifier}`;
  const [user, isLoadingUser] = useFetch<InstitutionUser>({
    url: openDialog ? `${RoleApiPath.Users}/${username}` : '',
    withAuthentication: true,
    errorMessage: false,
  });

  const initialValues: FormData = { roles: user ? user.roles.map((role) => role.rolename) : [RoleName.Creator] };

  const onSubmit = async (values: FormData) => {
    let updateUserResponse;
    if (user) {
      const newUser: InstitutionUser = {
        ...user,
        roles: values.roles.map((role) => ({ type: 'Role', rolename: role })),
      };

      updateUserResponse = await authenticatedApiRequest<null>({
        url: `${RoleApiPath.Users}/${username}`,
        method: 'PUT',
        data: newUser,
      });
    } else {
      updateUserResponse = await createUser({
        nationalIdentityNumber: nationalId,
        customerId,
        roles: values.roles.map((role) => ({ type: 'Role', rolename: role })),
      });
    }
    if (isSuccessStatus(updateUserResponse.status)) {
      toggleDialog();
      dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' }));
    } else if (isErrorStatus(updateUserResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' }));
    }
  };

  const activeAffiliation = filterActiveAffiliations(cristinPerson.affiliations);
  const employmentsInThisInstitution: CristinPersonAffiliation[] = [];
  const otherEmployments: CristinPersonAffiliation[] = [];
  const targetOrganizationIdStart = `${topOrgCristinIdentifier?.split('.')[0]}.`;
  for (const affiliation of activeAffiliation) {
    const organizationIdentifier = affiliation.organization.split('/').pop();
    if (organizationIdentifier?.startsWith(targetOrganizationIdStart)) {
      employmentsInThisInstitution.push(affiliation);
    } else {
      otherEmployments.push(affiliation);
    }
  }

  return (
    <TableRow>
      <TableCell>{cristinIdentifier}</TableCell>
      <TableCell>{getMaskedNationalIdentityNumber(nationalId)}</TableCell>
      <TableCell width="25%">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography>
            {firstName} {lastName}
          </Typography>
          {orcidUrl && (
            <Tooltip title={t('common.orcid_profile')}>
              <IconButton size="small" href={orcidUrl} target="_blank">
                <img src={OrcidLogo} height="20" alt="orcid" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
      <TableCell width="60%">
        <Box component="ul" sx={{ p: 0 }}>
          {activeEmployments.map((employment, index) => (
            <Box key={`${employment.organization}-${index}`} component="li" sx={{ display: 'flex' }}>
              <AffiliationHierarchy unitUri={employment.organization} commaSeparated />
            </Box>
          ))}
        </Box>
      </TableCell>
      <TableCell>
        <Tooltip title={t('common.edit')}>
          <IconButton onClick={toggleDialog}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </TableCell>

      <Dialog open={openDialog} onClose={toggleDialog} maxWidth="md" fullWidth transitionDuration={{ exit: 0 }}>
        <DialogTitle>{t('basic_data.person_register.edit_person')}</DialogTitle>
        <Formik initialValues={initialValues} enableReinitialize onSubmit={onSubmit}>
          {({ values, isSubmitting, setFieldValue }: FormikProps<FormData>) => (
            <Form>
              <DialogContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <TextField variant="filled" disabled value={firstName} label={t('common.first_name')} />
                    <TextField variant="filled" disabled value={lastName} label={t('common.last_name')} />
                    <TextField
                      variant="filled"
                      disabled
                      value={getMaskedNationalIdentityNumber(nationalId)}
                      label={t('basic_data.person_register.national_identity_number')}
                    />
                    <TextField variant="filled" disabled value={orcid} label={t('common.orcid')} />
                    {otherEmployments.length > 0 && (
                      <Box>
                        <Typography variant="overline">{t('basic_data.person_register.other_employees')}</Typography>
                        <Box component="ul" sx={{ my: 0, pl: '1rem' }}>
                          {otherEmployments.map((affiliation) => (
                            <li key={affiliation.organization}>
                              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                                <AffiliationHierarchy unitUri={affiliation.organization} commaSeparated />
                              </Box>
                            </li>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Divider flexItem orientation="vertical" />
                  <Box>
                    <Typography variant="overline">{t('common.employments')}</Typography>
                    {employmentsInThisInstitution.map((affiliation) => {
                      // TODO: Allow updating employment
                      return (
                        <AffiliationHierarchy
                          key={affiliation.organization}
                          unitUri={affiliation.organization}
                          commaSeparated
                        />
                      );
                    })}
                    <Box sx={{ mt: '2rem' }}>
                      <UserRolesSelector
                        selectedRoles={values.roles}
                        updateRoles={(newRoles) => setFieldValue('roles', newRoles)}
                        isLoading={isLoadingUser}
                        disabled={isSubmitting}
                      />
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={toggleDialog}>{t('common.cancel')}</Button>
                <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                  {t('common.save')}
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </TableRow>
  );
};
