export interface OrcidResponse {
  id: string;
  sub: string;
  name: string | null;
  family_name: string | null;
  given_name: string | null;
}

export interface OrcidCredentials {
  orcid: string | null;
  access_token: string | null;
  token_type: string | null;
  expires_in: number | null;
  tokenVersion: string | null;
  persistent: boolean | null;
  id_token: string | null;
  tokenId: number | null;
}
