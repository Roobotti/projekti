import { StyleSheet, ImageBackground } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import AppBar from './AppBar';
import { SignUp, SignIn, SignOut } from './Sign';
import Board from './SinglePlayer';
import Menu from './Menu';
import DevTest from '../devComponents/SolutionTest';
import DevMenu from '../devComponents/DevMenu';
import Build3dTest from '../devComponents/Build3DTest';
import BoardWrite from "./BoardWrite"
import { LobbyCollap } from './Lobby';
import { Profile } from './Profile';
import { Loading } from './Loading';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { AssetsContext } from '../contexts/AssetsContext';
import { View } from 'react-native-animatable';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

const Main = () => {
  const { assetsLoading, caveWall} = useContext(AssetsContext);

    if (assetsLoading) return(
        <View>
          <Loading/>
        </View>
    )

   return (
    <ImageBackground 
        source={caveWall}
        resizeMode='stretch'
        style={styles.container}
      >
          <AppBar />
          <Routes>
            <Route path="/" element={<Menu />} exact />
            <Route path="/SolutionTest" element={<DevTest />} exact />
            <Route path="/DevMenu" element={<DevMenu />} exact />
            <Route path="/3DbuildTest" element={<Build3dTest />} exact />
            <Route path="/singlePlayer" element={<Board />} exact />
            <Route path="/Lobby" element={<LobbyCollap />} exact />
            <Route path="/SignIn" element={<SignIn />} exact />
            <Route path="/SignUp" element={<SignUp />} exact />
            <Route path="/SignOut" element={<SignOut />} exact />
            <Route path="/boardWrite" element={<BoardWrite />} exact />
            <Route path="/profile" element={<Profile />} exact />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
    </ImageBackground>
  );
};

export default Main;