import { ImageBackground} from 'react-native';
import { Route, Routes, Navigate} from 'react-router-native';
import {StatusBar} from './AppBar';
import { SignUp, SignIn, SignOut } from './Sign';
import SinglePlayerMenu from './SinglePlayerMenu';
import SinglePlayer2D from './SinglePlayer2D';
import SinglePlayer3D from './SinglePlayer3D';
import Menu from './Menu';
import Build3dTest from '../devComponents/Build3dTest';
import BoardWrite from "./BoardWrite"
import { LobbyCollap } from './Lobby';
import { Profile } from './Profile';
import { Loading } from './Loading';
import { useContext } from 'react';
import { AssetsContext } from '../contexts/AssetsContext';
import { View } from 'react-native-animatable';
import MultiPlayer3D from './MultiPlayer3D';
import MultiPlayer from './MultiPlayer';
import FriendProfile from './Friend';
import { HistoryContext } from '../contexts/HistoryContext';



const Main = () => {
  const { assetsLoading, caveWall} = useContext(AssetsContext);
  const {myModal} = useContext(HistoryContext)

    if (assetsLoading) return(
        <View>
          <Loading/>
        </View>
    )
   return (
    <ImageBackground 
        source={caveWall}
        resizeMode='stretch'
        style={{flex: 1}}
      >
          {myModal}
          <StatusBar />
          <Routes>
            <Route path="/" element={<Menu />} exact />
            <Route path="/3DbuildTest" element={<Build3dTest />} exact />
            <Route path="/SinglePlayerMenu" element={<SinglePlayerMenu />} exact />
            <Route path="/SinglePlayer2D" element={<SinglePlayer2D />} exact />
            <Route path="/SinglePlayer3D" element={<SinglePlayer3D />}   exact />
            <Route path="/MultiPlayer3D" element={<MultiPlayer3D />}   exact />
            <Route path="/MultiPlayer" element={<MultiPlayer />}   exact />
            <Route path="/Lobby" element={<LobbyCollap />} exact />
            <Route path="/SignIn" element={<SignIn />} exact />
            <Route path="/SignUp" element={<SignUp />} exact />
            <Route path="/SignOut" element={<SignOut />} exact />
            <Route path="/boardWrite" element={<BoardWrite />} exact />
            <Route path="/profile" element={<Profile />} exact />
            <Route path="/Friend" element={<FriendProfile />} exact />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>


    </ImageBackground>
  );
};

export default Main;