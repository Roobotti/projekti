import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView, Alert, ImageBackground} from 'react-native';
import { useNavigate } from 'react-router-native';
import { UserContext } from '../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { uploadAvatar } from '../services/users';

import Text from './Text';
import { AssetsContext } from '../contexts/AssetsContext';
import MyModal from './MyModal';



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
  const {paint_wins, paint_loses, paint_delete, paint_X} = useContext(AssetsContext)
  const {avatar, token, user, wins, loses, setAvatar, level} = useContext(UserContext)
  const [signOut, setSignOut] = useState(false)
  const navigate = useNavigate();

  const onAvatarChange = async (image) => {
    setAvatar(image)
    uploadAvatar(token, image)
    // upload image to server here 
  };
  return (
    <View style={styles.container}>
        {signOut && <MyModal Title='Sign out' Info='Are you sure?' ContinueText='Sign out' To='/SignOut' SetHide={setSignOut}/>}

        <Text style={styles.name} >{user}</Text>

        <UserAvatar
          onChange={onAvatarChange}
          source={avatar}
        />
        
        <Text style={styles.name}>Level:{level}</Text>

        <View style={styles.deleteButton}>
          <ImageBackground source={paint_wins} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.text}>
              Wins:  {wins.length}
            </Text>
          </ImageBackground>
        </View>

        <View style={styles.deleteButton}>
          <ImageBackground source={paint_loses} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.text}>
              Loses:  {loses.length}
            </Text>
          </ImageBackground>
        </View>

        <TouchableOpacity onPress={() => setSignOut(true)} style={styles.deleteButton}>
          <ImageBackground source={paint_delete} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.deleteButtonText}>Sign Out</Text>
          </ImageBackground>
        </TouchableOpacity>

        
        <TouchableOpacity onPress={() => navigate("/", { replace: true })} style={styles.deleteButton}>
          <ImageBackground source={paint_X} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
          </ImageBackground>
        </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 10,  
    justifyContent:'space-evenly',
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
  },
  name: {
    fontSize: 30
  },
  avatar: {
    width: 200,
    height: 200,

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

    borderRadius: 80
  },
  deleteButton: {
    width: 120,
    height: 80,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  deleteButtonText: {
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'FreckleFace',
    color: 'white',
    opacity: 0.8
    
  },
});