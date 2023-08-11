

import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Animated, Easing, ImageBackground } from 'react-native';
import { Link } from 'react-router-native';

import { socket } from '../services/socket';

import { useState, useEffect, useContext, useRef   } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Loading } from './Loading';


const UnSigned = () => {
  return (
    <>
      <Link to="/SignIn" style={styles.option}>
        <Text style={styles.optionText}>Sign in</Text>
      </Link>
      <Link to="/SignUp" style={styles.option}>
        <Text style={styles.optionText}>Sign up</Text>
      </Link>
    </>
  )
}

const Signed = () => {
  return (
    <>
      <Link to="/Lobby" style={styles.option}>
        <Text style={styles.optionText}>Multiplayer</Text>
      </Link>
      <Link to="/profile" style={styles.option}>
        <Text style={styles.optionText}>profile</Text>
      </Link>
    </>
  )
}

const Menu = () => {
  const { user, room, invites, sentInvite, loading, fontsLoading, setSentInvite, setInvites, setRoom,} = useContext(UserContext);

  useEffect(() => {
    if (sentInvite) {
      socket.emit("cancel_invites", {"friend":sentInvite, "user":user})
      setSentInvite(null)
    }
    if (room) socket.emit("leave", {"user":user, "room":room})
  })
  
  if (fontsLoading) return(
    <ImageBackground source={require('../../assets/paint_brush.png')} resizeMode='stretch' style={{flex: 1, alignSelf:'center' ,justifyContent:'center'}}>
      <Loading/>
    </ImageBackground>)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground source={require('../../assets/paint_brush.png')} resizeMode='stretch' style={{flex: 1, alignSelf:'center' ,justifyContent:'center'}}>
      <Link to="/singlePlayer" style={styles.option}>
          <Text style={styles.optionText}>Single Player</Text>
      </Link>
      </ImageBackground>

      {user ? <Signed /> : loading ? <Loading/> : <UnSigned / >}
      
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  option: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 30,
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'Kablammo'
  },
});

export default Menu;