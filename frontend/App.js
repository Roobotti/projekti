import React from "react";
import { NativeRouter } from "react-router-native";
import { QueryClient, QueryClientProvider } from "react-query";
import Constants from "expo-constants";

import Main from "./src/components/Main";
import AuthStorageContext from "./src/contexts/AuthStorageContext";
import AuthStorage from "./src/utils/authStorage";

import { UserContextProvider } from "./src/contexts/UserContext";
import { GameContextProvider } from "./src/contexts/GameContext";
import { AssetsContextProvider } from "./src/contexts/AssetsContext";

const authStorage = new AuthStorage();
const queryClient = new QueryClient();

const App = () => {
  console.log("app", Constants.manifest.extra);

  return (
    <QueryClientProvider client={queryClient}>
      <NativeRouter>
        <AuthStorageContext.Provider value={authStorage}>
          <AssetsContextProvider>
            <UserContextProvider>
              <GameContextProvider>
                <Main />
              </GameContextProvider>
            </UserContextProvider>
          </AssetsContextProvider>
        </AuthStorageContext.Provider>
      </NativeRouter>
    </QueryClientProvider>
  );
};

export default App;
