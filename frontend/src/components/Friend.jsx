
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loadFriend } from '../services/users';
import { UserContext } from '../contexts/UserContext';
import { Loading } from './Loading';

const showAlert = (onDelete) =>
  Alert.alert(
    'Delete friend',
    'Are you sure?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => onDelete(),
        style: 'default'
      }
    ],
    {
      cancelable: true,
    },
  );

const VsText = ({wins, loses}) => {
  const textStyles = [
    styles.text,
    wins > loses ? styles.losing : styles.winning,
    wins===loses && styles.tied
  ];

  return <Text style={textStyles}>{loses} - {wins}</Text>;
};

const VsStatus = (wins, loses) => {
  if (wins===loses) return 'tied'
  return wins > loses ? 'losing' : 'winning'
}

const FriendProfile = ({ friend, onDelete, onBack }) => {
  const [friendData, setFriendData] = useState(null);
  const {user} = useContext(UserContext)
  const [friendWins, setFriendWins] = useState(0)
  const [friendLoses, setFriendLoses] = useState(0)

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
      console.log("ss", json.loses.filter(w => w === user).length)
    } catch (error) {
      console.error('Error loading friend data:', error);
    }
  };

  if (!friendData) return <Loading/>

  return (
    <View style={{flex:1, justifyContent:'space-between'}}>
      <View style={styles.container}>
        {friendData && <Image source={{ uri: `data:image/jpeg;base64,${friendData.avatar}` }} style={styles.avatar} />}

        <Text style={styles.name}>{friend}</Text>
        <Text style={styles.wins}>{`Total wins: ${friendData.wins ? friendData.wins.length : 0}`}</Text>

        <Text style={styles.wins}>You're {VsStatus(friendWins, friendLoses)}</Text>
        <VsText wins={friendWins} loses={friendLoses} />

        <TouchableOpacity onPress={() => showAlert(onDelete)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Friend</Text>
        </TouchableOpacity>

      </View>
      <TouchableOpacity onPress={() => onBack(null)} style={styles.tab}>
          <Text style={{color: 'red', fontSize:20}}> X </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  wins: {
    fontSize: 18,
    marginTop: 5,
  },
  text: {
    fontSize: 20,

  },
  winning: {
    color: 'green',
  },
  losing: {
    color: 'red',
  },
  tied: {
    color: 'black',
  },
  deleteButton: {
    backgroundColor: 'red',
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tab: {
    alignSelf: 'center',
    backgroundColor: 'rgba(1,1,1,0.4)',
    padding: 20,
    paddingHorizontal: 22,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderLeftWidth: 3,
    marginBottom: 20,
    borderRadius: 80,
  },
});

export default FriendProfile;
