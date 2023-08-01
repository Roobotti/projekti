
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { loadFriend } from '../services/users';


const FriendProfile = ({ friend, onDelete }) => {
  const [friendData, setFriendData] = useState(null);

  useEffect(() => {
    console.log("sjsjs", friend)
    loadFriendData();
  }, []);

  const loadFriendData = async () => {
    try {
      const data = await loadFriend(friend);
      setFriendData(await data);
    } catch (error) {
      console.error('Error loading friend data:', error);
    }
  };

  if (!friendData) return <View><Text>voi vittu</Text></View>
  return (
    <View style={styles.container}>
      {friendData && <Image source={{ uri: `data:image/jpeg;base64,${friendData.avatar}` }} style={styles.avatar} />}

      <Text style={styles.name}>{friend}</Text>
      <Text style={styles.wins}>{`Wins: ${friendData.wins ? friendData.wins.length : 0}`}</Text>
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
