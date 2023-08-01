import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export const UserAvatar = ({source, onChange}) => {
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
      <Button title="Upload image" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    paddingTop: 20,
    height: 100,
    width: 100,
    borderRadius: 100,
    padding: 20,
  },
});