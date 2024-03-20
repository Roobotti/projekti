import {  ScrollView, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import {  useNavigate } from 'react-router-native';

import { socket } from '../services/socket';

import { useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Loading } from '../components/Loading';
import { AssetsContext } from '../contexts/AssetsContext';

const DevMenu = () => {
  const { assetsLoading, paint_1, paint_3, paint_profile} = useContext(AssetsContext)
  const { user, room, sentInvite, loading, setSentInvite, setFriend} = useContext(UserContext);
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
      
        <TouchableOpacity onPress={() => navigate("/SolutionTest", { replace: true })} style={styles.option}>
          <ImageBackground source={paint_3} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.optionText}>Solution test</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate("/3DbuildTest", { replace: true })} style={styles.option}>
          <ImageBackground source={paint_3} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.optionText}> 3d build test</Text>
          </ImageBackground>
        </TouchableOpacity>
 
      
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

export default DevMenu;