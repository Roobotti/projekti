import { StyleSheet, View, ImageBackground } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import AppBar from './AppBar';
import { SignUp, SignIn, SignOut } from './Sign';
import Lobby from './Lobby';
import Board from './GameView';
import Menu from './Menu';
import MultiPlayer from './MultiPlayer';
import BoardWrite from "./BoardWrite"
import SolutionsWrite from './SolutionsWrite';
import { LobbyCollap } from './LobbyCollapsible';
import { Profile } from './Profile';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  image: {
    flex: 1,
    justifyContent: 'center'
  },

});

const Main = () => {
   return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/Grunge_Fiery.jpg')}
        resizeMode="cover"
        style={styles.image}
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
    </View>
  );
};

export default Main;