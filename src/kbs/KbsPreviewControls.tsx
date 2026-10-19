import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Button,
  Fab,
  FormControlLabel,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { ParseKeys } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KbsReportState } from './_hooks/useKbsReport';
import { canCloseKbsPeriod } from './_utils/kbs-period-helpers';
import { KbsRole } from './kbs-action-panel/kbs.types';

const roleLabelKeys: Record<KbsRole, ParseKeys> = {
  [KbsRole.ProjectLeader]: 'project.project_manager',
  [KbsRole.KbsAdmin]: 'kbs_admin',
  [KbsRole.LocalResponsible]: 'local_responsible',
  [KbsRole.ProjectMember]: 'project_member',
  [KbsRole.Anonymous]: 'anonymous_user',
};

const previewToolsId = 'kbs-preview-tools';

interface KbsPreviewControlsProps {
  role: KbsRole;
  onRoleChange: (role: KbsRole) => void;
  kbsReport: KbsReportState;
}

export const KbsPreviewControls = ({ role, onRoleChange, kbsReport }: KbsPreviewControlsProps) => {
  const { t } = useTranslation();
  const { status, isProjectActive, setIsProjectActive, closeKbsPeriod, resetKbsReport } = kbsReport;
  const [isOpen, setIsOpen] = useState(true);

  const toggleLabel = isOpen ? t('hide_preview_tools') : t('show_preview_tools');

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 'speedDial',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.5rem',
      }}>
      {isOpen && (
        <Paper
          id={previewToolsId}
          elevation={6}
          sx={{
            width: '16rem',
            p: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            border: '2px dashed',
            borderColor: 'warning.main',
          }}>
          <Box>
            <Typography variant="h3">{t('preview_tools')}</Typography>
            <Typography variant="caption">{t('kbs_preview_tools_description')}</Typography>
          </Box>

          <TextField
            select
            size="small"
            label={t('common.role')}
            value={role}
            onChange={(event) => onRoleChange(event.target.value as KbsRole)}>
            {Object.values(KbsRole).map((roleOption) => (
              <MenuItem key={roleOption} value={roleOption}>
                {t(roleLabelKeys[roleOption])}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Switch
                color="secondary"
                checked={isProjectActive}
                onChange={(event) => setIsProjectActive(event.target.checked)}
              />
            }
            label={t('project_is_active')}
          />

          <Button variant="outlined" disabled={!canCloseKbsPeriod(status)} onClick={closeKbsPeriod}>
            {t('close_kbs_period')}
          </Button>
          <Button variant="outlined" onClick={resetKbsReport}>
            {t('reset')}
          </Button>
        </Paper>
      )}

      <Tooltip title={toggleLabel} placement="right">
        <Fab
          size="small"
          aria-label={toggleLabel}
          aria-expanded={isOpen}
          aria-controls={previewToolsId}
          onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? <CloseIcon /> : <SettingsIcon />}
        </Fab>
      </Tooltip>
    </Box>
  );
};
