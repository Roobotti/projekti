import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "../graphql/queries";

const useMe = () => {
  const { data, loading, ...result } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "cache-and-network",
  });

  return { user: data?.me, loading, result };
};

export default useMe;
