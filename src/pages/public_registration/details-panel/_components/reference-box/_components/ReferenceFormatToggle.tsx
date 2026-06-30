import { SxProps, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../../../../utils/dataTestIds';

export type ReferenceFormat = 'plain' | 'bibtex';

const tabSx: SxProps = {
  textTransform: 'none',
  '&.Mui-selected': { fontWeight: 'bold' },
};

export const referenceFormatPanelId = 'reference-format-tabpanel';

export const getReferenceFormatTabId = (format: ReferenceFormat) => `reference-format-tab-${format}`;

interface ReferenceFormatToggleProps {
  value: ReferenceFormat;
  onChange: (value: ReferenceFormat) => void;
}

export const ReferenceFormatToggle = ({ value, onChange }: ReferenceFormatToggleProps) => {
  const { t } = useTranslation();

  return (
    <Tabs
      value={value}
      onChange={(_, newValue: ReferenceFormat) => onChange(newValue)}
      variant="fullWidth"
      aria-label={t('reference_format')}
      data-testid={dataTestId.registrationLandingPage.detailsTab.referenceFormatToggle}
      slotProps={{ indicator: { sx: { bgcolor: 'secondary.main', height: '0.1rem' } } }}
      sx={{ mb: '0.5rem' }}>
      <Tab
        value="plain"
        label={t('reference_format_plain')}
        id={getReferenceFormatTabId('plain')}
        aria-controls={referenceFormatPanelId}
        sx={tabSx}
      />
      <Tab
        value="bibtex"
        label={t('reference_format_bibtex')}
        id={getReferenceFormatTabId('bibtex')}
        aria-controls={referenceFormatPanelId}
        sx={tabSx}
      />
    </Tabs>
  );
};
