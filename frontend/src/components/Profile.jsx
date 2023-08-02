import React, { useContext, useEffect, useState } from 'react';
import {StatusBar, StyleSheet, View, TouchableOpacity, Image, ScrollView, Text} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { json } from 'react-router-native';
import { uploadAvatar } from '../services/users';


const UserAvatar = ({source, onChange}) => {
  const [image, setImage] = useState(source);

  const pickImage  = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true,
    });
    if (!result.canceled) {
      const img = result.assets[0].base64
      setImage(img);
      onChange(img)
    }
  };
  return (
    <View >
      {image && 
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: `data:image/*;base64,${image}` }} style={styles.avatar}/>
        </TouchableOpacity>
      }
    </View>
  );
}

export const Profile = () => {
  const {avatar, token, user, friends, wins, loses, setAvatar} = useContext(UserContext)

  const onAvatarChange = async (image) => {
    setAvatar(image)
    uploadAvatar(token, image)
    // upload image to server here 
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.text} >{user}</Text>

      <UserAvatar
        onChange={onAvatarChange}
        source={avatar}
      />

      <Text style={styles.text} >Wins:{wins.length}</Text>

      <Text style={styles.text} >Loses:{loses.length}</Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  userRow: {
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#d8d8db',
  },
  text: {
    fontSize: 18,
    marginBottom: 20
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 50,
    borderRadius: 50,
    alignSelf: 'center',
  },
});