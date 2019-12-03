import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Switch from '@material-ui/core/Switch';
import ContributorArrows from './ContributorArrows';
import DeleteIcon from '@material-ui/icons/Delete';
import Person from '@material-ui/icons/Person';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const BaseSelectStyle = styled(Select)`
  height: 2rem;
  background-color: white;
`;

const BaseContainerStyle = styled.div`
  background-color: ${({ theme }) => theme.palette.box.main};
  display: grid;
  grid-column-gap: 0.5rem;
  align-items: center;
`;

const StyledContributor = {
  ContributorContainer: styled(BaseContainerStyle)`
    grid-template-areas: 'icon name institution switch orcid arrows delete';
    grid-template-columns: 5% 40% 25% 10% 5% 5% 5%;
  `,

  OtherContributorContainer: styled(BaseContainerStyle)`
    grid-template-areas: 'type name institution delete';
    grid-template-columns: 20% 40% 25% 5%;
  `,

  PersonIcon: styled(Person)`
    grid-area: icon;
    color: green;
  `,

  Name: styled.div`
    grid-area: name;
  `,

  Select: BaseSelectStyle,

  TypeSelect: styled(BaseSelectStyle)`
    grid-area: type;
  `,

  InstitutionSelect: styled(BaseSelectStyle)`
    grid-area: institution;
  `,

  CorrespondingAuthor: styled(Switch)`
    grid-area: switch;
  `,

  OrcidIcon: styled.div`
    grid-area: orcid;
  `,

  ContributorsArrows: styled(ContributorArrows)`
    grid-area: arrows;
  `,

  DeleteIcon: styled(DeleteIcon)`
    grid-area: delete;
    color: red;
  `,
  VerifyPerson: styled(Button)`
    grid-area: verify-person;
    margin-right: 1rem;
    margin-left: 1rem;
  `,

  AddCircleIcon: styled(AddCircleIcon)`
    grid-area: icon;
  `,

  MainHeading: styled.div`
    font-weight: bold;
  `,

  Box: styled(Box)`
    background-color: ${({ theme }) => theme.palette.box.main};
    padding: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  `,

  AddIcon: styled(AddIcon)`
    height: 1rem;
  `,

  AuthorsButton: styled(Button)`
    color: blue;
    text-decoration: underline;
  `,
};

export default StyledContributor;
