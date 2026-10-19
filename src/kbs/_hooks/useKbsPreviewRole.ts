import { useState } from 'react';
import { KbsRole } from '../kbs-action-panel/kbs.types';

const kbsPreviewRoleStorageKey = 'kbs-preview-role';

const isKbsRole = (value: string | null): value is KbsRole => Object.values(KbsRole).includes(value as KbsRole);

const readKbsPreviewRole = () => {
  const storedRole = localStorage.getItem(kbsPreviewRoleStorageKey);
  return isKbsRole(storedRole) ? storedRole : KbsRole.ProjectLeader;
};

/** The role chosen in the preview controls, kept in localStorage across reloads */
export const useKbsPreviewRole = () => {
  const [role, setRole] = useState(readKbsPreviewRole);

  const updateRole = (newRole: KbsRole) => {
    localStorage.setItem(kbsPreviewRoleStorageKey, newRole);
    setRole(newRole);
  };

  return [role, updateRole] as const;
};
