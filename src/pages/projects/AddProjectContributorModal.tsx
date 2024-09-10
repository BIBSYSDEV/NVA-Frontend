import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/notificationSlice';
import {
  ProjectContributor,
  ProjectContributorIdentity,
  ProjectContributorRole,
  ProjectContributorType,
} from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { getValueByKey } from '../../utils/user-helpers';
import { AddProjectContributorForm } from './AddProjectContributorForm';
import { AddProjectManagerForm } from './AddProjectManagerForm';

interface AddProjectContributorModalProps {
  open: boolean;
  toggleModal: () => void;
  initialSearchTerm?: string;
  addProjectManager?: boolean;
  suggestedProjectManager?: string;
  indexToReplace?: number;
}

export const AddProjectContributorModal = ({
  open,
  toggleModal,
  suggestedProjectManager,
  addProjectManager = false,
  initialSearchTerm,
  indexToReplace = -1,
}: AddProjectContributorModalProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const addContributor = (
    personToAdd: CristinPerson | undefined,
    contributors: ProjectContributor[],
    roleToAddTo: ProjectContributorType,
    index = -1
  ) => {
    if (!personToAdd) {
      return;
    }

    let newContributor: ProjectContributor;
    let existingContributorIndex: number;

    const newContributorIdentity: ProjectContributorIdentity = {
      type: 'Person',
      id: personToAdd.id,
      firstName: getValueByKey('FirstName', personToAdd.names),
      lastName: getValueByKey('LastName', personToAdd.names),
    };

    if (index > -1) {
      existingContributorIndex = index;
    } else {
      existingContributorIndex = contributors.findIndex((contributor) => contributor.identity.id === personToAdd.id);
    }

    if (existingContributorIndex > -1) {
      const sameRoleAndSameType = contributors[existingContributorIndex].roles.some((role) => {
        return (
          role.type === roleToAddTo &&
          personToAdd.affiliations.some((affiliation) => affiliation.organization === role.affiliation?.id)
        );
      });

      if (sameRoleAndSameType) {
        dispatch(
          setNotification({
            message: t('project.error.contributor_already_added_with_same_role_and_affiliation'),
            variant: 'error',
          })
        );
        return;
      }

      // Replacing unidentified contributor with contributor selected from search
      if (index > -1) {
        newContributor = { identity: newContributorIdentity, roles: [...contributors[existingContributorIndex].roles] };
      } else {
        // Adding new contributor from search, but contributor already exists (for instance with other role)
        newContributor = { ...contributors[existingContributorIndex] };
      }
    } else {
      // Contributor is brand new
      newContributor = { identity: newContributorIdentity, roles: [] };
    }

    // Adding 1 or more affiliations
    if (personToAdd.affiliations.length > 0) {
      newContributor.roles = [...newContributor.roles].concat(
        personToAdd.affiliations
          .filter((_, index) => roleToAddTo !== 'ProjectManager' || index === 0) // For project managers, we only allow one affiliation
          .map((affiliation) => {
            return {
              type: roleToAddTo,
              affiliation: { type: 'Organization', id: affiliation.organization, labels: {} },
            } as ProjectContributorRole;
          })
      );
    } else {
      // Adding no affiliations
      newContributor.roles = [
        ...newContributor.roles,
        {
          type: 'ProjectParticipant',
          affiliation: undefined,
        } as ProjectContributorRole,
      ];
    }

    const newContributors = [...contributors];

    if (existingContributorIndex > -1) {
      newContributors[existingContributorIndex] = newContributor;
    } else {
      newContributors.push(newContributor);
    }

    return newContributors;
  };

  return (
    <Modal
      headingText={addProjectManager ? t('project.add_project_manager') : t('project.add_project_contributor')}
      open={open}
      onClose={toggleModal}
      fullWidth
      maxWidth="md"
      dataTestId="contributor-modal">
      {addProjectManager ? (
        <AddProjectManagerForm
          toggleModal={toggleModal}
          addContributor={addContributor}
          suggestedProjectManager={suggestedProjectManager}
        />
      ) : (
        <AddProjectContributorForm
          toggleModal={toggleModal}
          addContributor={addContributor}
          initialSearchTerm={initialSearchTerm}
          indexToReplace={indexToReplace}
        />
      )}
    </Modal>
  );
};
