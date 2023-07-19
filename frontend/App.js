import { NativeRouter } from "react-router-native";
import Constants from "expo-constants";

import Main from "./src/components/Main";
import AuthStorageContext from "./src/contexts/AuthStorageContext";
import AuthStorage from "./src/utils/authStorage";
import { BoardContextProvider } from "./src/contexts/BoardContext";
import { BlocksContextProvider } from "./src/contexts/BlockContext";

const App = () => {
  console.log("app", Constants.manifest.extra);

  return (
    <BoardContextProvider>
      <BlocksContextProvider>
        <NativeRouter>
          <AuthStorageContext.Provider value={AuthStorage}>
            <Main />
          </AuthStorageContext.Provider>
        </NativeRouter>
      </BlocksContextProvider>
    </BoardContextProvider>
  );
};

export default App;
