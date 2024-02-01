import { Box, TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import { InstitutionUser } from '../../types/user.types';
import { ViewingScopeChip } from '../basic_data/institution_admin/edit_user/AreaOfResponsibility';
import { UserFormDialog } from '../basic_data/institution_admin/edit_user/UserFormDialog';

interface EditorCuratorRowProps {
  curator: InstitutionUser;
}

export const EditorCuratorRow = ({ curator }: EditorCuratorRowProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => setOpenDialog(!openDialog);

  return (
    <>
      <TableRow
        key={curator.username}
        hover
        onClick={curator.cristinId ? toggleDialog : undefined}
        sx={{ cursor: 'pointer' }}>
        <TableCell>
          {curator.givenName} {curator.familyName}
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {curator.viewingScope?.includedUnits.map((orgId) => (
              <ViewingScopeChip key={orgId} organizationId={orgId} />
            ))}
          </Box>
        </TableCell>
      </TableRow>
      {curator.cristinId && (
        <UserFormDialog
          open={openDialog}
          onClose={toggleDialog}
          existingPerson={curator.cristinId}
          existingUser={curator}
        />
      )}
    </>
  );
};
