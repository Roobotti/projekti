import React, { useContext, useEffect, useState } from 'react';
import {StatusBar, StyleSheet, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import { Link } from 'react-router-native';
import { UserContext } from '../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { uploadAvatar } from '../services/users';

import Text from './Text';

const Tab = ({ text, to, ...props }) => {
  return (
    <Link to={to} {...props}>
      <Text fontSize="subheading" color="textSecondary" style={{padding: 20}}>{text}</Text>
    </Link>
  )
}

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
  const {avatar, token, user, friends, wins, loses, setAvatar, setReFresh} = useContext(UserContext)

  useEffect( () => {
    setReFresh(Math.random())
  }, [])

  const onAvatarChange = async (image) => {
    setAvatar(image)
    uploadAvatar(token, image)
    // upload image to server here 
  };
  return (
    <View style={{flex:1, justifyContent:'space-between'}}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.text} >{user}</Text>

        <UserAvatar
          onChange={onAvatarChange}
          source={avatar}
        />

        <Text style={styles.text} >Wins:{wins.length}</Text>

        <Text style={styles.text} >Loses:{loses.length}</Text>

  
      </ScrollView>

      <View style={styles.tab}>
          <Tab to="/" text="X"/>
      </View>
      
    </View>
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
  tab: {
    alignSelf: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 5,
    marginBottom: 20,
    borderRadius: 80
  }
});