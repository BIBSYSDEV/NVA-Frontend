import { Autocomplete, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchApprovals } from '../../api/hooks/useSearchApprovals';
import { Approval } from '../../types/approval.types';
import { isSupportedApproval } from '../../utils/approval-helpers';
import { useDebounce } from '../../utils/hooks/useDebounce';
import { AutocompleteTextField } from '../AutocompleteTextField';

interface ApprovalSearchProps {
  selectedApproval: Approval | null;
  onChange: (approval: Approval | null) => void;
  dataTestId?: string;
}

export const ApprovalSearch = ({ selectedApproval, onChange, dataTestId }: ApprovalSearchProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const approvalsQuery = useSearchApprovals(debouncedSearchTerm);
  const approvals = approvalsQuery.data?.hits ?? [];

  return (
    <Autocomplete
      data-testid={dataTestId}
      options={approvals}
      value={selectedApproval}
      filterOptions={(options) => options}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionDisabled={(option) => !isSupportedApproval(option)}
      onInputChange={(_, newInputValue, reason) => {
        if (reason === 'input') {
          setSearchTerm(newInputValue);
        } else if (reason === 'clear') {
          setSearchTerm('');
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

const ApprovalOption = ({ approval }: ApprovalOptionProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle1">{approval.title}</Typography>
      {approval.identifiers.map((identifier) => (
        <Typography key={`${identifier.name}-${identifier.value}`}>
          {identifier.name}: {identifier.value}
        </Typography>
      ))}
      {!isSupportedApproval(approval) && <Typography>{t('approval_source_not_supported')}</Typography>}
    </Box>
  );
};
