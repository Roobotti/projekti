import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView, Alert, ImageBackground} from 'react-native';
import { useNavigate } from 'react-router-native';
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

        <View style={styles.deleteButton}>
          <ImageBackground source={require('../../assets/paints/paint_wins.png')} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.text}>
              Wins:  {wins.length}
            </Text>
          </ImageBackground>
        </View>

        <View style={styles.deleteButton}>
          <ImageBackground source={require('../../assets/paints/paint_loses.png')} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.text}>
              Loses:  {loses.length}
            </Text>
          </ImageBackground>
        </View>

        <TouchableOpacity onPress={() => showAlert(navigate)} style={styles.deleteButton}>
          <ImageBackground source={require('../../assets/paints/paint_delete.png')} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.deleteButtonText}>Sign Out</Text>
          </ImageBackground>
        </TouchableOpacity>

        
        <TouchableOpacity onPress={() => navigate("/", { replace: true })} style={styles.deleteButton}>
          <ImageBackground source={require('../../assets/paints/paint_X.png')} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
          </ImageBackground>
        </TouchableOpacity>
      
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,

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
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'FreckleFace',
    color: 'white',
    opacity: 0.8,
    marginBottom: 10
  },
  avatar: {
    width: 200,
    height: 200,
    marginBottom: 20,
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
    width: 120,
    height: 80,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  
  deleteButtonText: {
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'FreckleFace',
    color: 'white',
    opacity: 0.8
    
  },
});