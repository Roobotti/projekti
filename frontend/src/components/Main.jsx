import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import AppBar from './AppBar';
import SignIn from './SignIn';
import Board from './GameView';

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
        <Route path="/" element={<Board />} exact />
        {//<Route path="/SignIn" element={<SignIn />} exact />
}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;