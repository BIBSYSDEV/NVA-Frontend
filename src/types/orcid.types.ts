export interface OrcidResponse {
  id: string;
  sub: string;
  name: string | null;
  family_name: string | null;
  given_name: string | null;
}

export interface OrcidCredentials {
  orcid: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  tokenVersion: string;
  persistent: boolean;
  idToken: string;
  tokenId: number;
}
