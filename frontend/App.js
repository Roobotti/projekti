import React from "react";
import { NativeRouter } from "react-router-native";
import { QueryClient, QueryClientProvider } from "react-query";
import Constants from "expo-constants";

import Main from "./src/components/Main";
import AuthStorageContext from "./src/contexts/AuthStorageContext";
import AuthStorage from "./src/utils/authStorage";
import { BoardContextProvider } from "./src/contexts/BoardContext";
import { BlocksContextProvider } from "./src/contexts/BlockContext";
import { ScreenContextProvider } from "./src/contexts/SceenContext";
import { UserContextProvider } from "./src/contexts/UserContext";

const authStorage = new AuthStorage();
const queryClient = new QueryClient();

const App = () => {
  console.log("app", Constants.manifest.extra);

  return (
    <QueryClientProvider client={queryClient}>
      <BoardContextProvider>
        <BlocksContextProvider>
          <ScreenContextProvider>
            <NativeRouter>
              <AuthStorageContext.Provider value={authStorage}>
                <UserContextProvider>
                  <Main />
                </UserContextProvider>
              </AuthStorageContext.Provider>
            </NativeRouter>
          </ScreenContextProvider>
        </BlocksContextProvider>
      </BoardContextProvider>
    </QueryClientProvider>
  );
};

export default App;
