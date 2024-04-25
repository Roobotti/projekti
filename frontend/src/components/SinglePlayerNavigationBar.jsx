
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import Text from '../components/Text';
import { useNavigate } from 'react-router-native';
import MyModal from './MyModal';



const SpNavi = ({getData, score=0, streak3D=0}) => {

  const [menu, setMenu] = useState(false)
  const [next, setNext] = useState(false)
  const navigate = useNavigate()

  const NewBoard = () => {
    return(
      <TouchableOpacity onPress={() => {(score || !streak3D ) ? getData() : setNext(true)}} style={styles.newBoard}>
        <Text style={styles.text}>New board</Text>
      </TouchableOpacity>
    )
  }

  const Menu = () => {

    return(
      <TouchableOpacity onPress={() => (streak3D) ? setMenu(true) : navigate("/SinglePlayerMenu", { replace: true })} style={styles.menu}>
        <Text style={styles.text}>{'Leave'}</Text>
      </TouchableOpacity>
    )
  }


  return (
    <View>
        {menu && <MyModal Info='You will lose your streak!' To='/SinglePlayerMenu' SetHide={setMenu} />}
        {next && <MyModal Info='You will lose your streak!' ContinueTask={getData} SetHide={setNext} />}
        <View style={{height:60}} >
          <View style={styles.navigationBar}>
            <Menu/>
            <NewBoard/>
          </View>
        </View>
    </View>
  )

}

export default SpNavi

const styles = StyleSheet.create({

  navigationBar: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 10,
    flexDirection: "row", 
    alignContent:'space-around',
    backgroundColor:"rgba(0,0,0, 0.5)", 
    paddingBottom:8,
    borderBottomWidth:4,
},

  newBoard : {
    flex: 1,

    alignItems:'center',
    paddingVertical:7,
    backgroundColor:'rgba(217, 121, 80, 0.6)',
    borderWidth:1.5, 
    borderBottomWidth:4, 
    borderLeftWidth:2,
    borderColor:'rgba(0, 0, 0, 0.7)', 
    borderRadius: 8,

  },

  menu : {
    flex:0.7,

    alignItems:'center',
    paddingVertical:7,
    backgroundColor:'rgba(217, 121, 80, 0.6)',
    borderWidth:1.5, 
    borderBottomWidth:4,
    borderRightWidth:2,
    borderColor:'rgba(0, 0, 0, 0.7)', 
    borderRadius: 8,

  },

   text: {fontSize:20},

});