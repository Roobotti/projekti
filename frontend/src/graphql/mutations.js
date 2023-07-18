import { gql } from "@apollo/client";

export const SIGNIN_MUTATION = gql`
  mutation ($credentials: AuthenticateInput) {
    authenticate(credentials: $credentials) {
      accessToken
    }
  }
`;
