import { KbsRole, KbsStatus } from '../kbs-action-panel/kbs.types';

const kbsEditorRoles = [KbsRole.ProjectLeader, KbsRole.KbsAdmin];

export const canEditKbs = (role: KbsRole) => kbsEditorRoles.includes(role);

/** Local responsible see the panel once the project is a candidate. Project members and anonymous users never see it */
export const canSeeKbsPanel = (role: KbsRole, status: KbsStatus) =>
  canEditKbs(role) || (role === KbsRole.LocalResponsible && status !== KbsStatus.NotAssessed);
