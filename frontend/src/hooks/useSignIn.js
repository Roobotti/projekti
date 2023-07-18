import { useMutation } from "@apollo/client";

import { SIGNIN_MUTATION } from "../graphql/mutations";

import { useAuthStorage } from "../hooks/useAuthStorage";

import { useNavigate } from "react-router-native";
import { useApolloClient } from "@apollo/client";

export const useSignIn = () => {
  const authStorage = useAuthStorage();
  const [mutate, result] = useMutation(SIGNIN_MUTATION);
  const navigate = useNavigate();
  const apolloClient = useApolloClient();

  const signIn = async ({ username, password }) => {
    return await mutate({
      variables: {
        credentials: {
          username,
          password,
        },
      },
      onCompleted: async (data) => {
        console.log("data: ", authStorage);
        await authStorage.setAccessToken(data.authenticate.accessToken);
        navigate("/", { replace: true });
        apolloClient.resetStore();
      },
    });
  };
  return [signIn, result];
};
