import { Box, MenuItem, TextField, Typography } from '@mui/material';
import { ProjectSearchParameter } from '../../../api/cristinApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { TFuncKey } from 'i18next';
import React from 'react';

interface FilterItem {
  field: string;
  i18nKey: TFuncKey;
}

enum Status {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  CONCLUDED = 'CONCLUDED',
  NOTSTARTED = 'NOTSTARTED',
}

export const ProjectStatusFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const onStatusChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const status = event.target.value ?? '';
    if (Object.values<string>(Status).includes(status) && status != Status.ALL) {
      addStatusFilter(status);
    } else {
      removeStatusFilter();
    }
  };

  const addStatusFilter = (status: string) => {
    searchParams.set(ProjectSearchParameter.Status, status);
    history.push({ search: searchParams.toString() });
  };

  const removeStatusFilter = () => {
    searchParams.delete(ProjectSearchParameter.Status);
    history.push({ search: searchParams.toString() });
  };

  const statusFilters: FilterItem[] = [
    { field: Status.ALL, i18nKey: 'common.show_all' },
    { field: Status.ACTIVE, i18nKey: 'project.status.ACTIVE' },
    { field: Status.CONCLUDED, i18nKey: 'project.status.CONCLUDED' },
    { field: Status.NOTSTARTED, i18nKey: 'project.status.NOTSTARTED' },
  ];

  return (
    <Box>
      <Typography fontWeight={600}>{t('common.project_status')}</Typography>
      <TextField
        select
        sx={{
          border: '2px solid',
          borderRadius: '10px',
          div: {
            borderRadius: '10px',
            paddingTop: '6px',
          },
        }}
        defaultValue={Status.ALL}
        fullWidth
        onChange={(event) => onStatusChange(event)}
        data-testid={dataTestId.startPage.projectStatusFilter}
        variant="filled">
        {statusFilters.map((filter) => (
          <MenuItem key={filter.i18nKey} value={filter.field}>
            {t<any>(filter.i18nKey)}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
