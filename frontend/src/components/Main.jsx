import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import AppBar from './AppBar';
import { SignUp, SignIn, SignOut } from './Sign';
import Lobby from './Lobby';
import Board from './GameView';
import Menu from './Menu';
import MultiPlayer from './MultiPlayer';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {

   return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<Menu />} exact />
        <Route path="/singlePlayer" element={<Board />} exact />
        <Route path="/MultiPlayer/:host" render={(props) => <MultiPlayer {...props} />} exact/>
        <Route path="/Lobby" element={<Lobby />} exact />
        <Route path="/SignIn" element={<SignIn />} exact />
        <Route path="/SignUp" element={<SignUp />} exact />
        <Route path="/SignOut" element={<SignOut />} exact />
        {//<Route path="/SignIn" element={<SignIn />} exact />
}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;