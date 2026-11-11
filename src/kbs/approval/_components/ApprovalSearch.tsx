import { Autocomplete, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { useSearchApprovals } from '../_hooks/useSearchApprovals';
import { Approval } from '../approval.types';
import { ApprovalIdentifiers } from './ApprovalIdentifiers';

interface ApprovalSearchProps {
  selectedApproval: Approval | null;
  onChange: (approval: Approval | null) => void;
}

export const ApprovalSearch = ({ selectedApproval, onChange }: ApprovalSearchProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const approvalsQuery = useSearchApprovals(debouncedSearchTerm);
  const approvals = approvalsQuery.data?.hits ?? [];

  return (
    <Autocomplete
      options={approvals}
      value={selectedApproval}
      filterOptions={(options) => options}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onInputChange={(_, newInputValue, reason) => {
        if (reason === 'input') {
          setSearchTerm(newInputValue);
        }
      }}
      onChange={(_, value) => onChange(value)}
      popupIcon={null}
      loading={approvalsQuery.isFetching}
      renderInput={(params) => (
        <AutocompleteTextField
          {...params}
          label={t('approval')}
          isLoading={approvalsQuery.isFetching}
          placeholder={t('search_for_approval_title_or_id')}
        />
      )}
      renderOption={({ key, ...props }, option) => (
        <li {...props} key={option.id}>
          <ApprovalOption approval={option} />
        </li>
      )}
    />
  );
};

interface ApprovalOptionProps {
  approval: Approval;
}

const ApprovalOption = ({ approval }: ApprovalOptionProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <Typography variant="subtitle1">{approval.title}</Typography>
    <ApprovalIdentifiers identifiers={approval.identifiers} />
  </Box>
);
