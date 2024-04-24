import {  ScrollView, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import {  useNavigate } from 'react-router-native';


import { useContext } from 'react';

import { AssetsContext } from '../contexts/AssetsContext';

const SinglePlayerMenu = () => {
  const { paint_1, paint_3, paint_profile} = useContext(AssetsContext)

  const navigate = useNavigate();
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
        <TouchableOpacity onPress={() => navigate("/SinglePlayer3D", { replace: true })} style={styles.option}>
          <ImageBackground source={paint_1} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.optionText}>PLAY 3D</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate("/SinglePlayer2D", { replace: true })} style={styles.option}>
          <ImageBackground source={paint_1} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.optionText}>Classic</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate("/", { replace: true })} style={styles.option}>
          <ImageBackground source={paint_3} resizeMode='stretch' style={{flex: 1, alignSelf: 'stretch', justifyContent:'center'}}>
            <Text style={styles.optionText}>
               Menu
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  option: {
    width: 250,
    height: 120,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
    marginBottom: 30,
  },
  optionText: {
    fontSize: 28,
    alignSelf: 'center',
    fontFamily: 'FreckleFace',
    color: 'white'
  },
});

export default SinglePlayerMenu;