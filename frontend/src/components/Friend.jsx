
import React, { useState, useEffect, useContext } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { loadFriend } from '../services/users';
import { UserContext } from '../contexts/UserContext';
import { Loading } from './Loading';

import Text from './Text';
import { AssetsContext } from '../contexts/AssetsContext';
import { sendDeleteFriend } from '../services/users';
import { useLocation, useNavigate } from 'react-router-native';
import MyModal from './MyModal';






const VsText = ({wins, loses}) => {
  const colors = {losing: 'rgba(255,0,0,0.1)', winning:'rgba(0,255,0,0.1)', tied:'rgba(100,100,100,0.1)'}
  const backgroundColor = (wins === loses) ? colors.tied : (wins > loses) ? colors.losing : colors.winning

  return <View style={{...styles.vsTextContainer, backgroundColor}}><Text style={styles.vsText}>{loses} - {wins}</Text></View>
};

const VsStatus = (wins, loses) => {
  if (wins===loses) return 'tied'
  return wins > loses ? 'losing' : 'winning'
}

const FriendProfile = () => {
  const {paint_delete, paint_X} = useContext(AssetsContext)
  const {user, token, friends, setFriends} = useContext(UserContext)
  const [friendData, setFriendData] = useState(null);
  const [friendWins, setFriendWins] = useState(0)
  const [friendLoses, setFriendLoses] = useState(0)
  const [dModal, setDModal] = useState(false)

  const friend = useLocation().state.friend
  const navigate = useNavigate()

  const handleDeleteFriend = () => {
    setFriends(friends.filter((f) => f.username !== friend))
    sendDeleteFriend(token, friend)
  }


  useEffect(() => {
    loadFriendData();
  }, []);

  const loadFriendData = async () => {
    try {
      const data = await loadFriend(friend);
      const json = await data.json()
      setFriendData(json);
      setFriendWins(json.wins ? json.wins.filter(w => w === user).length : 0)
      setFriendLoses(json.loses ? json.loses.filter(w => w === user).length : 0)
    } catch (error) {
      console.error('Error loading friend data:', error);
    }
  };

  if (!friendData) return <Loading/>

  return (
    <View style={{flex:1, justifyContent:'space-around', alignItems:'center'}}>
      {dModal && <MyModal Title="Delete friend" Info="Are you sure?" ContinueText="Delete" CancelText="Cancel" ContinueTask={handleDeleteFriend} To="/Lobby" SetHide={setDModal} />}
      {friendData && <Image source={{ uri: `data:image/jpeg;base64,${friendData.avatar}` }} style={styles.avatar} />}
      <Text style={styles.name}>{friend}</Text>

      <View style={styles.container}>
        
        <Text style={styles.name}>{`Level: ${friendData.level}`}</Text>

        <Text style={styles.wins}>{`Total wins: ${friendData.wins ? friendData.wins.length : 0}`}</Text>
        <Text style={styles.wins}>You're {VsStatus(friendWins, friendLoses)}</Text>
        <VsText wins={friendWins} loses={friendLoses} />

        

      </View>
      <TouchableOpacity onPress={() => setDModal(true)} style={{...styles.deleteButton,width: 180}}>
          <ImageBackground source={paint_delete} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.deleteButtonText}>Delete Friend</Text>
          </ImageBackground>
        </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate("/Lobby", { replace: true })} style={styles.deleteButton}>
          <ImageBackground source={paint_X} resizeMode='stretch' style={styles.leave}>
          </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:0.5,
    alignItems: 'center',
    justifyContent:'space-around',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'rgba(1,1,1,0.3)',
    alignSelf: 'center',
  },
  name: {
    fontSize: 28,
  },
  wins: {
    fontSize: 18,
  },
  text: {
    fontSize: 20,

  },
  vsTextContainer: {
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  vsText:{
    fontSize: 20,
  },

  deleteButtonText: {
    fontSize: 18,
    alignSelf: 'center',
    fontFamily: 'FreckleFace',
    color: 'white',
    opacity: 0.8
  },
  deleteButton: {
    width: 120,
    height: 80,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leave: {
    flex: 1, 
    alignSelf: 'stretch', 
  }
  
});

export default FriendProfile;
