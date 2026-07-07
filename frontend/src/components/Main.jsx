import { ImageBackground, View } from "react-native";
import { Route, Routes, Navigate } from "react-router-native";
import { lazy, Suspense, useContext } from "react";

import { StatusBar } from "./AppBar";
import { SignUp, SignIn, SignOut } from "./Sign";
import Menu from "./Menu";
import { Loading } from "./Loading";
import { AssetsContext } from "../contexts/AssetsContext";
import { HistoryContext } from "../contexts/HistoryContext";

const SinglePlayerMenu = lazy(() => import("./SinglePlayerMenu"));
const SinglePlayer2D = lazy(() => import("./SinglePlayer2D"));
const SinglePlayer3D = lazy(() => import("./SinglePlayer3D"));
const MultiPlayer3D = lazy(() => import("./MultiPlayer3D"));
const MultiPlayer = lazy(() => import("./MultiPlayer"));
const BoardWrite = lazy(() => import("./BoardWrite"));
const LobbyCollap = lazy(() => import("./Lobby").then((m) => ({ default: m.LobbyCollap })));
const Profile = lazy(() => import("./Profile").then((m) => ({ default: m.Profile })));
const FriendProfile = lazy(() => import("./Friend"));

const Main = () => {
  const { assetsLoading, caveWall } = useContext(AssetsContext);
  const { myModal } = useContext(HistoryContext);

  if (assetsLoading) {
    return (
      <View>
        <Loading />
      </View>
    );
  }

  return (
    <ImageBackground
      source={caveWall}
      resizeMode="stretch"
      style={{ flex: 1 }}
    >
      {myModal}
      <StatusBar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Menu />} exact />
          <Route path="/SinglePlayerMenu" element={<SinglePlayerMenu />} exact />
          <Route path="/SinglePlayer2D" element={<SinglePlayer2D />} exact />
          <Route path="/SinglePlayer3D" element={<SinglePlayer3D />} exact />
          <Route path="/MultiPlayer3D" element={<MultiPlayer3D />} exact />
          <Route path="/MultiPlayer" element={<MultiPlayer />} exact />
          <Route path="/Lobby" element={<LobbyCollap />} exact />
          <Route path="/SignIn" element={<SignIn />} exact />
          <Route path="/SignUp" element={<SignUp />} exact />
          <Route path="/SignOut" element={<SignOut />} exact />
          <Route path="/boardWrite" element={<BoardWrite />} exact />
          <Route path="/profile" element={<Profile />} exact />
          <Route path="/Friend" element={<FriendProfile />} exact />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ImageBackground>
  );
};

export default Main;
