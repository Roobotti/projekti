import React, { useContext } from 'react';
import {StatusBar, StyleSheet, View, Image} from 'react-native';
import {UserAvatar} from './UserAvatar';
import { UserContext } from '../contexts/UserContext';

import { uploadAvatar } from '../services/users';



export const Profile = () => {
  const {avatar, token, wins, setAvatar} = useContext(UserContext)

  const onAvatarChange = async (image) => {
    setAvatar(image)
    uploadAvatar(token, image)
    // upload image to server here 
  };
  return (
    <View style={styles.scroll}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.userRow}>
        <UserAvatar
          onChange={onAvatarChange}
          source={avatar}
        />
        {avatar && <Image source={{ uri: `data:image/*;base64,${avatar}` }} style={styles.avatar}/>}
      </View>
      <View style={styles.content} />
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
    flex: 1,
  },
  userRow: {
    alignItems: 'center',
    padding: 15,
    marginTop: 70,
  },
  content: {
    flex: 1,
    backgroundColor: '#d8d8db',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 30
  },
});