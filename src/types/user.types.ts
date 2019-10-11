export default interface User {
  email: string;
  name: string;
  id: string;
  institution: string;
}

export const emptyUser: User = {
  name: '',
  email: '',
  id: '',
  institution: '',
};
