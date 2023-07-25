

import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';


import { useState, useEffect, useContext  } from 'react';
import { UserContext } from '../contexts/UserContext';


const Sign = () => {
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

const Logout = () => {
  return (
    <>
      <Link to="/SignOut" style={styles.option}>
        <Text style={styles.optionText}>Sign out</Text>
      </Link>
    </>
  )
}

const Menu = () => {
  const { user } = useContext(UserContext);
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Link to="/singlePlayer" style={styles.option}>
        <Text style={styles.optionText}>Single Player</Text>
      </Link>
      <Link to="/multiplayer" style={styles.option}>
        <Text style={styles.optionText}>Multiplayer</Text>
      </Link>

      {!user ? <Sign /> : <Logout />}
      

      

      
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