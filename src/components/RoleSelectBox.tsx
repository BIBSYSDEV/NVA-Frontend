import { Checkbox, CheckboxProps, FormControlLabel, FormControlLabelProps, Typography } from '@mui/material';

interface RoleSelectBoxProps
  extends Pick<FormControlLabelProps, 'sx' | 'disabled'>,
    Pick<CheckboxProps, 'checked' | 'value'> {
  label: string;
  description?: string;
}

export const RoleSelectBox = ({ label, description, disabled, checked, value, sx }: RoleSelectBoxProps) => {
  return (
    <FormControlLabel
      sx={{ p: '0.25rem', pr: '1rem', borderRadius: '0.5rem', ...sx }}
      disabled={disabled}
      control={<Checkbox checked={checked} value={value} />}
      label={
        <>
          <Typography sx={{ fontWeight: 600, color: disabled ? undefined : 'textPrimary' }}>{label}</Typography>
          <Typography>{description}</Typography>
        </>
      }
    />
  );
};
