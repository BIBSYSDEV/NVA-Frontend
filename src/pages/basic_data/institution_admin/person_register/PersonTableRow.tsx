import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import OrcidLogo from '../../../../resources/images/orcid_logo.svg';
import { CristinPerson, Employment, RoleName } from '../../../../types/user.types';
import { ORCID_BASE_URL } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';
import {
  convertToFlatCristinPerson,
  getFullCristinName,
  getMaskedNationalIdentityNumber,
  isActiveEmployment,
} from '../../../../utils/user-helpers';
import { UserFormDialog } from '../edit_user/UserFormDialog';

export interface PersonData {
  employments: Employment[];
  roles: RoleName[];
}

interface PersonTableRowProps {
  cristinPerson: CristinPerson;
  topOrgCristinIdentifier: string;
  refetchEmployees: () => void;
}

export const PersonTableRow = ({ cristinPerson, topOrgCristinIdentifier, refetchEmployees }: PersonTableRowProps) => {
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => {
    if (openDialog) {
      refetchEmployees();
    }
    setOpenDialog(!openDialog);
  };

  const { cristinIdentifier, employments, orcid, nationalId } = convertToFlatCristinPerson(cristinPerson);
  const orcidUrl = orcid ? `${ORCID_BASE_URL}/${orcid}` : '';

  const fullName = getFullCristinName(cristinPerson.names);

  const activeEmployments = employments.filter(isActiveEmployment);
  const employmentsInThisInstitution: Employment[] = [];
  const employmentsInOtherInstitutions: Employment[] = [];
  const targetOrganizationIdStart = `${topOrgCristinIdentifier?.split('.')[0]}.`;

  employments.forEach((employment) => {
    const organizationIdentifier = employment.organization.split('/').pop();
    if (organizationIdentifier?.startsWith(targetOrganizationIdStart)) {
      employmentsInThisInstitution.push(employment);
    } else {
      employmentsInOtherInstitutions.push(employment);
    }
  });

  // TODO: ensure all this code is kept (if needed)
  // const updatePersonAndRoles = async (values: PersonData) => {
  //   // Update Cristin Person
  //   const updatedPerson: CristinPerson = {
  //     ...cristinPerson,
  //     employments: values.employments,
  //     keywords: cristinPerson.verified ? cristinPerson.keywords : undefined,
  //   };
  //   const updateCristinPerson = await authenticatedApiRequest({
  //     url: cristinPerson.id,
  //     method: 'PATCH',
  //     data: updatedPerson,
  //   });
  //   if (isSuccessStatus(updateCristinPerson.status)) {
  //     if (cristinPerson.verified) {
  //       // Update NVA User
  //       const filteredRoles = !values.roles.includes(RoleName.PublishingCurator)
  //         ? values.roles.filter((role) => role !== RoleName.CuratorThesis && role !== RoleName.CuratorThesisEmbargo)
  //         : values.roles;

  //       let updateUserResponse;
  //       if (institutionUser) {
  //         const updatedInstitutionUser: InstitutionUser = {
  //           ...institutionUser,
  //           roles: filteredRoles.map((role) => ({ type: 'Role', rolename: role })),
  //         };

  //         updateUserResponse = await authenticatedApiRequest<null>({
  //           url: `${RoleApiPath.Users}/${username}`,
  //           method: 'PUT',
  //           data: updatedInstitutionUser,
  //         });
  //       } else {
  //         updateUserResponse = await createUser({
  //           nationalIdentityNumber: nationalId,
  //           customerId,
  //           roles: filteredRoles.map((role) => ({ type: 'Role', rolename: role })),
  //         });
  //       }
  //       if (isSuccessStatus(updateUserResponse.status)) {
  //         await institutionUserQuery.refetch();
  //         toggleDialog();
  //         dispatch(setNotification({ message: t('feedback.success.update_institution_user'), variant: 'success' }));
  //       } else if (isErrorStatus(updateUserResponse.status)) {
  //         dispatch(setNotification({ message: t('feedback.error.update_institution_user'), variant: 'error' }));
  //       }
  //     } else {
  //       dispatch(setNotification({ message: t('feedback.success.update_person'), variant: 'success' }));
  //       toggleDialog();
  //     }
  //   } else {
  //     dispatch(setNotification({ message: t('feedback.error.update_person'), variant: 'error' }));
  //   }
  // };

  return (
    <>
      <TableRow onClick={toggleDialog} sx={{ cursor: 'pointer' }}>
        <TableCell data-testid={dataTestId.basicData.personAdmin.cristinId(cristinIdentifier)}>
          {cristinIdentifier}
        </TableCell>
        <TableCell data-testid={dataTestId.basicData.personAdmin.nin(cristinIdentifier)}>
          {getMaskedNationalIdentityNumber(nationalId)}
        </TableCell>
        <TableCell width="25%" data-testid={dataTestId.basicData.personAdmin.name(cristinIdentifier)}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{fullName}</Typography>
            {orcidUrl && (
              <Tooltip title={t('common.orcid_profile')}>
                <IconButton size="small" href={orcidUrl} target="_blank">
                  <img src={OrcidLogo} height="20" alt="orcid" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </TableCell>
        <TableCell width="60%" data-testid={dataTestId.basicData.personAdmin.employments(cristinIdentifier)}>
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
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <UserFormDialog open={openDialog} onClose={toggleDialog} existingPerson={cristinPerson} />
    </>
  );
};
