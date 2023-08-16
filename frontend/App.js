import React from "react";
import { NativeRouter } from "react-router-native";
import { QueryClient, QueryClientProvider } from "react-query";
import Constants from "expo-constants";

import Main from "./src/components/Main";
import AuthStorageContext from "./src/contexts/AuthStorageContext";
import AuthStorage from "./src/utils/authStorage";

import { UserContextProvider } from "./src/contexts/UserContext";

const authStorage = new AuthStorage();
const queryClient = new QueryClient();

const App = () => {
  console.log("app", Constants.manifest.extra);

  return (
    <QueryClientProvider client={queryClient}>
      <NativeRouter>
        <AuthStorageContext.Provider value={authStorage}>
          <UserContextProvider>
            <Main />
          </UserContextProvider>
        </AuthStorageContext.Provider>
      </NativeRouter>
    </QueryClientProvider>
  );
};

export default App;
