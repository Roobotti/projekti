import React from "react";
import { View, Text, ScrollView } from "react-native";
import { NativeRouter } from "react-router-native";

import { QueryClient, QueryClientProvider } from "react-query";

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

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView
          style={{ flex: 1, backgroundColor: "#111", padding: 24, paddingTop: 60 }}
        >
          <Text style={{ color: "#f55", fontSize: 18, marginBottom: 12 }}>
            App crashed on startup
          </Text>
          <Text style={{ color: "#fff", fontFamily: "monospace" }}>
            {String(this.state.error?.message || this.state.error)}
          </Text>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;
