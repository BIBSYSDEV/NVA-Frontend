export default interface OrcidResponse {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
  scope: string;
  name: string;
  orcid: string;
}
