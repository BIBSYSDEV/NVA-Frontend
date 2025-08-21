import { useTranslation } from 'react-i18next';

interface SourceValueProps {
  label: string;
  value: string | undefined;
}

export const SourceValue = ({ label, value = '' }: SourceValueProps) => {
  const { t } = useTranslation();

  return (
    <dl style={{ margin: 0 }}>
      <dt style={{ fontWeight: 'bold' }}>{label}</dt>
      <dd style={{ margin: 0, fontStyle: value ? 'normal' : 'italic' }}>{value || t('missing_value')}</dd>
    </dl>
  );
};
