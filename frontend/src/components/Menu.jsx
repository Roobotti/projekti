

import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';

import { socket } from '../services/socket';

import { useState, useEffect, useContext  } from 'react';
import { UserContext } from '../contexts/UserContext';


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
  const { user, room, invites, sentInvite, setSentInvite, setInvites, setRoom,} = useContext(UserContext);

  useEffect(() => {
    if (sentInvite) {
      socket.emit("cancel_invites", {"friend":sentInvite, "user":user})
      setSentInvite(null)
    }
    if (room) socket.emit("leave", {"user":user, "room":room})
    
    socket.on(`${user}/post`, (data) => {
      console.log("sender", data.user)
      switch (data.type) {
        case "invite":
          setInvites(...invites, data.user);
          console.log("invited");
          break;
        case "cancel_invite":
          setInvites(invites.filter((i) => i !== data.user));
          console.log("invite_removed");
          break;
      }
    })
  }, [user])
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Link to="/singlePlayer" style={styles.option}>
        <Text style={styles.optionText}>Single Player</Text>
      </Link>

      {user ? <Signed /> : <UnSigned />}
      
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
  },
});

export default Menu;