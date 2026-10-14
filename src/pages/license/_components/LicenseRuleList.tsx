import { SvgIconComponent } from '@mui/icons-material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LicenseRule, LicenseRuleGroup } from '../license-deed-config';

const groupIcon: Record<LicenseRuleGroup, SvgIconComponent> = {
  [LicenseRuleGroup.Permissions]: CheckCircleOutlinedIcon,
  [LicenseRuleGroup.Conditions]: InfoOutlinedIcon,
  [LicenseRuleGroup.Limitations]: BlockIcon,
};

const groupColor: Record<LicenseRuleGroup, string> = {
  [LicenseRuleGroup.Permissions]: 'success.main',
  [LicenseRuleGroup.Conditions]: 'info.main',
  [LicenseRuleGroup.Limitations]: 'error.main',
};

interface LicenseRuleListProps {
  group: LicenseRuleGroup;
  rules: LicenseRule[];
}

/**
 * One section of a license deed: the heading for a {@link LicenseRuleGroup} and the terms in it,
 * each with a short explanation.
 */
export const LicenseRuleList = ({ group, rules }: LicenseRuleListProps) => {
  const { t } = useTranslation();
  const Icon = groupIcon[group];

  return (
    <section>
      <Typography component="h2" variant="h3" gutterBottom>
        {t(`licenses.deed.${group}`)}
      </Typography>
      {/* NOTE: Safari drops the list semantics when the markers are removed, so the role is restated. */}
      <Box component="ul" role="list" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '0.75rem' }}>
        {rules.map((rule) => (
          <Box component="li" key={rule} sx={{ display: 'flex', gap: '0.5rem' }}>
            <Icon aria-hidden sx={{ color: groupColor[group], flexShrink: 0 }} />
            <div>
              <Typography sx={{ fontWeight: 'bold' }}>
                {t(`licenses.rules.${rule}.label`)}{' '}
                {/* The rule's English term, which the deeds inherit from choosealicense. */}
                <Box component="i" lang="en" sx={{ fontWeight: 'normal' }}>
                  ({t(`licenses.rules.${rule}.term`)})
                </Box>
              </Typography>
              <Typography>{t(`licenses.rules.${rule}.description`)}</Typography>
            </div>
          </Box>
        ))}
      </Box>
    </section>
  );
};
