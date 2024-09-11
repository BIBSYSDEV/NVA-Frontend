import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/notificationSlice';
import {
  CristinProject,
  ProjectContributor,
  ProjectContributorIdentity,
  ProjectContributorRole,
  ProjectContributorType,
} from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { getValueByKey } from '../../utils/user-helpers';
import { findNonProjectManagerRole, findProjectManagerRole } from '../project/helpers/projectRoleHelpers';
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
  suggestedProjectManager = '',
  addProjectManager = false,
  initialSearchTerm = '',
  indexToReplace = -1,
}: AddProjectContributorModalProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values } = useFormikContext<CristinProject>();
  const { contributors } = values;

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
      const contributorToReplace = contributors[existingContributorIndex];

      const sameRoleAndSameType = contributorToReplace.roles.some(
        (role) =>
          role.type === roleToAddTo &&
          personToAdd.affiliations.some((affiliation) => affiliation.organization === role.affiliation?.id)
      );

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
        newContributor = {
          identity: newContributorIdentity,
          roles: contributorToReplace.roles.filter(
            (role) => (role.type === roleToAddTo && role.affiliation?.id) || role.type !== roleToAddTo
          ),
        };
      } else {
        // Adding new contributor from search, on contributor that already exists (for instance with other role)
        newContributor = { ...contributors[existingContributorIndex] };
      }
    } else {
      // Contributor is brand new - new identity and new roles
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
      // If contributor has no other roles of this type, we need a role without affiliation to store the role name

      if (
        (addProjectManager && !findProjectManagerRole(newContributor)) ||
        (!addProjectManager && !findNonProjectManagerRole(newContributor))
      ) {
        newContributor.roles = [
          ...newContributor.roles, // Keep existing roles since they may contain other role types
          {
            type: roleToAddTo,
            affiliation: undefined,
          } as ProjectContributorRole,
        ];
      }
    }

    const newContributors = [...contributors];

    if (existingContributorIndex > -1) {
      newContributors[existingContributorIndex] = newContributor;
    } else {
      newContributors.push(newContributor);
    }

    return newContributors;
  };

  const addUnidentifiedProjectParticipant = (searchTerm: string, role: ProjectContributorType) => {
    if (!searchTerm) {
      return;
    }

    const names = searchTerm.split(' ');
    let firstName, lastName;

    if (names.length > 1) {
      const namesWithoutLastName = names.slice(0, -1);
      firstName = namesWithoutLastName.join(' ');
      lastName = names[names.length - 1];
    } else {
      firstName = names[0];
      lastName = '';
    }

    const newContributor: ProjectContributor = {
      identity: {
        type: 'Person',
        firstName: firstName,
        lastName: lastName,
      },
      roles: [
        {
          type: role,
          affiliation: undefined,
        } as ProjectContributorRole,
      ],
    };
    const newContributors = [...contributors];
    newContributors.push(newContributor);
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
          initialSearchTerm={initialSearchTerm}
          indexToReplace={indexToReplace}
          addUnidentifiedProjectParticipant={addUnidentifiedProjectParticipant}
        />
      ) : (
        <AddProjectContributorForm
          toggleModal={toggleModal}
          addContributor={addContributor}
          initialSearchTerm={initialSearchTerm}
          indexToReplace={indexToReplace}
          addUnidentifiedProjectParticipant={addUnidentifiedProjectParticipant}
        />
      )}
    </Modal>
  );
};
