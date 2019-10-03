export default interface User {
  email: string;
  name: string;
}

export const emptyUser: User = {
  name: '',
  email: '',
};
