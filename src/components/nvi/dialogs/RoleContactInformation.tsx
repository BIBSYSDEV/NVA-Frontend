import { ContactInformationLayout } from './ContactInformationLayout';
import { CuratorName } from './CuratorName';

interface RoleContactInformationProps {
  roleName: string;
  name: string;
  cristinId?: string;
}

export const RoleContactInformation = ({ roleName, name, cristinId }: RoleContactInformationProps) => {
  return (
    <ContactInformationLayout roleName={roleName}>
      <CuratorName name={name} cristinId={cristinId} />
    </ContactInformationLayout>
  );
};
