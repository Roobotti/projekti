import React, { useContext, useEffect, useState } from 'react';
import {StatusBar, StyleSheet, View, TouchableOpacity, Image, ScrollView, Alert} from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import { UserContext } from '../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { uploadAvatar } from '../services/users';

import Text from './Text';


const showAlert = (navigate) =>
  Alert.alert(
    'Log out',
    'Are you sure?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log out',
        onPress: () => navigate("/SignOut", { replace: true }),
        style: 'default'
      }
    ],
    {
      cancelable: true,
    },
  );

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
  const navigate = useNavigate();

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

        <TouchableOpacity onPress={() => showAlert(navigate)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>

      <Tab to="/" text={<Text style={{color:'red', fontSize:20}}>X</Text>} style={styles.tab}/>
      
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
    width: 200,
    height: 200,
    marginBottom: 50,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'rgba(1,1,1,0.3)',
    alignSelf: 'center',
  },
  tab: {
    alignSelf: 'center',
    backgroundColor: 'rgba(1,1,1,0.4)',
    paddingHorizontal: 8,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderLeftWidth: 3,
    marginBottom: 20,
    borderRadius: 80
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