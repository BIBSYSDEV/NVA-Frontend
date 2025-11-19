import { displayDate } from '../../../utils/date-helpers';
import { Typography, TypographyProps } from '@mui/material';
import { RegistrationDate } from '../../../types/registration.types';

export interface DateTextProps {
  publicationDate: Omit<RegistrationDate, 'type'>;
  showYearOnly?: boolean;
  textColor?: TypographyProps['color'];
}

export const DateText = ({ publicationDate, showYearOnly = false, textColor }: DateTextProps) => {
  return (
    <Typography sx={{ fontWeight: 'bold', color: textColor }}>
      {showYearOnly ? publicationDate.year : displayDate(publicationDate)}
    </Typography>
  );
};
