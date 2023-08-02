
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { loadFriend } from '../services/users';
import { UserContext } from '../contexts/UserContext';

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

const FriendProfile = ({ friend, onDelete }) => {
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
      setFriendData(data);
      setFriendWins(data.wins ? data.wins.filter(w => w === user).length : 0)
      setFriendLoses(data.loses ? data.loses.filter(w => w === user).length : 0)
      console.log("ss", data.loses.filter(w => w === user).length)
    } catch (error) {
      console.error('Error loading friend data:', error);
    }
  };

  if (!friendData) return <View><Text>loading</Text></View>

  return (
    <View style={styles.container}>
      {friendData && <Image source={{ uri: `data:image/jpeg;base64,${friendData.avatar}` }} style={styles.avatar} />}

      <Text style={styles.name}>{friend}</Text>
      <Text style={styles.wins}>{`Total wins: ${friendData.wins ? friendData.wins.length : 0}`}</Text>

      <Text style={styles.wins}>You're {VsStatus(friendWins, friendLoses)}</Text>
      <VsText wins={friendWins} loses={friendLoses} />

      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete Friend</Text>
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
    fontSize: 18,
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
});

export default FriendProfile;
