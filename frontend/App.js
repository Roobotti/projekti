import React from "react";
import { NativeRouter } from "react-router-native";

import { QueryClient, QueryClientProvider } from "react-query";
import Constants from "expo-constants";

import Main from "./src/components/Main";
import AuthStorageContext from "./src/contexts/AuthStorageContext";
import AuthStorage from "./src/utils/authStorage";

import { UserContextProvider } from "./src/contexts/UserContext";
import { GameContextProvider } from "./src/contexts/GameContext";
import { Game3dContextProvider } from "./src/contexts/Game3dContext";
import { AssetsContextProvider } from "./src/contexts/AssetsContext";
import { Online3DContextProvider } from "./src/contexts/Online3DContext";
import { HistoryContextProvider } from "./src/contexts/HistoryContext";
import { SocketContextProvider } from "./src/contexts/SocketContext";

const authStorage = new AuthStorage();
const queryClient = new QueryClient();

const App = () => {
  console.log("app", Constants.expoConfig);

  return (
    <NativeRouter>
      <HistoryContextProvider>
        <QueryClientProvider client={queryClient}>
          <AuthStorageContext.Provider value={authStorage}>
            <AssetsContextProvider>
              <UserContextProvider>
                <GameContextProvider>
                  <Game3dContextProvider>
                    <Online3DContextProvider>
                      <SocketContextProvider>
                        <Main />
                      </SocketContextProvider>
                    </Online3DContextProvider>
                  </Game3dContextProvider>
                </GameContextProvider>
              </UserContextProvider>
            </AssetsContextProvider>
          </AuthStorageContext.Provider>
        </QueryClientProvider>
      </HistoryContextProvider>
    </NativeRouter>
  );
};

export default App;
