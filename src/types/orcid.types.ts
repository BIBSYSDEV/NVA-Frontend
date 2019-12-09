export default interface OrcidResponse {
  id: string;
  sub: string;
  name: string | null;
  family_name: string | null;
  given_name: string | null;
}
