

import {  ScrollView, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import {  useNavigate } from 'react-router-native';

import { socket } from '../services/socket';

import { useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Loading } from './Loading';
import { AssetsContext } from '../contexts/AssetsContext';

import {  loadFriendData} from '../services/users';

const UnSigned = ({navigate, paint_1}) => {
  return (
    <>
      <TouchableOpacity onPress={() => navigate("/SignIn", { replace: true })} style={styles.option}>
        <ImageBackground source={paint_1} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
          <Text style={styles.optionText}>Sign in</Text>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate("/SignUp", { replace: true })} style={styles.option}>
        <ImageBackground source={paint_1} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
          <Text style={styles.optionText}>Sign up</Text>
        </ImageBackground>

      </TouchableOpacity>
    </>
  )
}

const Signed = ({navigate, paint_1, paint_profile}) => {
  return (
    <>
      <TouchableOpacity onPress={() => navigate("/Lobby", { replace: true })} style={styles.option}>
        <ImageBackground source={paint_1} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
          <Text style={styles.optionText}>Multiplayer</Text>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate("/profile", { replace: true })}  style={styles.option}>
        <ImageBackground source={paint_profile} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
          <Text style={styles.optionText}>Profile</Text>
        </ImageBackground>
      </TouchableOpacity>
    </>
  )
}

const Menu = () => {
  const { assetsLoading, paint_1, paint_3, paint_profile} = useContext(AssetsContext)
  const { user, room, friends, invites, sentInvite, loading, setSentInvite, setFriend, setInvites, setFriends} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (sentInvite) {
      socket.emit("cancel_invites", {"friend":sentInvite, "user":user})
      setSentInvite(null)
    }
    if (room) socket.emit("leave", {"user":user, "room":room})
    setFriend(null)

  })
  
  if (assetsLoading || loading) return <Loading/>

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
        <TouchableOpacity onPress={() => navigate("/SinglePlayerMenu", { replace: true })} style={styles.option}>
          <ImageBackground source={paint_3} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.optionText}>Single Player</Text>
          </ImageBackground>
        </TouchableOpacity>

      {user ? <Signed navigate={navigate} paint_1={paint_1} paint_profile={paint_profile} /> : loading ? <Loading/> : <UnSigned navigate={navigate} paint_1={paint_1}/ >}
      
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 50,
  },
  option: {
    width: 250,
    height: 120,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
    marginBottom: 30,
  },
  optionText: {
    fontSize: 28,
    alignSelf: 'center',
    fontFamily: 'FreckleFace',
    color: 'white'
  },
});

export default Menu;