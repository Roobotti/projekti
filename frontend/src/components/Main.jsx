import { StyleSheet, ImageBackground } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import AppBar from './AppBar';
import { SignUp, SignIn, SignOut } from './Sign';
import Board from './SinglePlayer';
import Menu from './Menu';
import MultiPlayer from './MultiPlayer';
import BoardWrite from "./BoardWrite"
import { LobbyCollap } from './Lobby';
import { Profile } from './Profile';
import { Loading } from './Loading';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

const Main = () => {
  const { fontsLoading} = useContext(UserContext);

    if (fontsLoading) return(
      <ImageBackground 
        source={require('../../assets/caveWall.png')}
        resizeMode='stretch'
        style={styles.container}
      >
        <Loading/>

      </ImageBackground>
    )

   return (
    <ImageBackground 
        source={require('../../assets/caveWall.png')}
        resizeMode='stretch'
        style={styles.container}
      >
          <AppBar />
          <Routes>
            <Route path="/" element={<Menu />} exact />
            <Route path="/singlePlayer" element={<Board />} exact />
            <Route path="/MultiPlayer/:host" render={(props) => <MultiPlayer {...props} />} exact/>
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