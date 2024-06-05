import { MenuItem, Select, Typography } from '@mui/material';
import { ParseKeys } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ProjectSearchParameter } from '../../../api/cristinApi';
import { ProjectStatus } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface FilterItem {
  statusValue: ProjectStatus | '';
  i18nKey: ParseKeys;
}

const statusFilters: FilterItem[] = [
  { statusValue: '', i18nKey: 'common.show_all' },
  { statusValue: 'ACTIVE', i18nKey: 'project.status.ACTIVE' },
  { statusValue: 'CONCLUDED', i18nKey: 'project.status.CONCLUDED' },
  { statusValue: 'NOTSTARTED', i18nKey: 'project.status.NOTSTARTED' },
];

export const ProjectStatusFilter = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  return (
    <div>
      <Typography fontWeight={600}>{t('common.project_status')}</Typography>
      <Select
        sx={{
          border: '2px solid',
          borderRadius: '10px',
          div: {
            borderRadius: '10px',
            paddingTop: '6px',
          },
          '&::before': {
            borderBottom: 'none !important',
          },
          '&::after': {
            borderBottom: 'none',
          },
        }}
        defaultValue={searchParams.get(ProjectSearchParameter.Status) ?? ''}
        fullWidth
        displayEmpty
        onChange={(event) => {
          const status = event.target.value;
          if (!status) {
            searchParams.delete(ProjectSearchParameter.Status);
          } else {
            searchParams.set(ProjectSearchParameter.Status, status);
          }
          history.push({ search: searchParams.toString() });
        }}
        data-testid={dataTestId.startPage.projectStatusFilter}
        variant="filled">
        {statusFilters.map((filter) => (
          <MenuItem key={filter.i18nKey} value={filter.statusValue}>
            {t<any>(filter.i18nKey)}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
