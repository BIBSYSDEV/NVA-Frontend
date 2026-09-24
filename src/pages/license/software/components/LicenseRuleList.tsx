import { Box, Typography } from '@mui/material';
import { LicenseRule, licenseRuleTexts } from './utils/software-license-helpers';

interface LicenseRuleListProps {
  title: string;
  rules: LicenseRule[];
}

/**
 * One section of guidance points on a software license deed page (Permissions, Conditions or
 * Limitations). Each point shows the Norwegian term, the English original term in italics for
 * legal comparison, and a plain-language explanation.
 * Renders nothing when the license has no points in the section.
 */
export const LicenseRuleList = ({ title, rules }: LicenseRuleListProps) => {
  if (rules.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: '1.5rem' }}>
      <Typography component="h2" variant="h2" gutterBottom>
        {title}
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: '1.25rem' }}>
        {rules.map((rule) => {
          const { name, originalTerm, description } = licenseRuleTexts[rule];

          return (
            <Typography component="li" key={rule} sx={{ mb: '0.5rem' }}>
              <strong>{name}</strong> <em>({originalTerm})</em> — {description}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
};
