import { Checkbox, CheckboxProps, FormControlLabel, FormControlLabelProps, Typography } from '@mui/material';

interface RoleSelectBoxProps
  extends Pick<FormControlLabelProps, 'sx' | 'disabled' | 'label'>,
    Pick<CheckboxProps, 'checked' | 'value'> {
  description: string;
}

export const RoleSelectBox = ({ label, description, disabled, checked, value, sx }: RoleSelectBoxProps) => (
  <FormControlLabel
    sx={{ p: '0.25rem', pr: '1rem', borderRadius: '0.5rem', ...sx }}
    disabled={disabled}
    control={<Checkbox checked={checked} value={value} />}
    label={
      <>
        <Typography sx={{ fontWeight: 600, color: disabled ? undefined : 'textPrimary' }}>{label}</Typography>
        <Typography sx={{ color: disabled ? undefined : 'textPrimary' }}>{description}</Typography>
      </>
    }
  />
);
