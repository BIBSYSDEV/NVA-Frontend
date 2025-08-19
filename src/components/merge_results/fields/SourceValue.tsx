interface SourceValueProps {
  label: string;
  value: string | undefined;
}

export const SourceValue = ({ label, value }: SourceValueProps) => {
  return (
    <dl style={{ margin: 0 }}>
      <dt style={{ fontWeight: 'bold' }}>{label}</dt>
      <dd style={{ margin: 0 }}>{value}</dd>
    </dl>
  );
};
