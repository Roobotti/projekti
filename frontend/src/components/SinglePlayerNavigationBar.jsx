
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';

import Text from '../components/Text';
import { useNavigate } from 'react-router-native';



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
        <Text style={styles.text}>Menu</Text>
      </TouchableOpacity>
    )
  }

  const MyModal = ()  => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={(next || menu)}
        onRequestClose={() => {setMenu(false); setNext(false)}}
        >
          <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.text}>Are you sure?</Text>
            <Text style={styles.text}>You will lose your streak!</Text>
            {menu && (
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setMenu(false)
                  navigate("/SinglePlayerMenu", { replace: true })
                }
                }>
                <Text style={styles.text}>Menu</Text>
              </TouchableOpacity>
            )
            }{next && (
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setNext(false)
                  //setStreak(0)
                  getData()
                }}>
                <Text style={styles.text}>Next</Text>
              </TouchableOpacity>
            )
            }
            <TouchableOpacity
              style={[styles.button, styles.buttonContinue]}
              onPress={() => {
                setMenu(false); 
                setNext(false)
              }}>
              <Text style={styles.text}>Keep going</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View>
        <MyModal/>
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
  topLayerBuf: {
    backgroundColor:'red',
    height:100,
    margin:'auto',
    bottom: 130,
    zIndex:1,

  },
  topLayer: {
    position: 'absolute',
    alignSelf:'center',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    width:75,
    height:75,

    bottom: 130,
    //backgroundColor:'rgba(217, 121, 80, 0.6)', 
    borderWidth:4,
    borderColor:'rgba(0, 0, 0, 0.7)',
    borderRadius:80,
    zIndex:3,
  },

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

  gameContainer: {
    flex:1, 
    justifyContent:'flex-start',
  },

  blocksContainer: {
    backgroundColor: "rgba(0,0,0, 0.6)", 
    padding:8,
    borderTopWidth:4,
   },

   text: {fontSize:20},



   modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0, 0.8)",
  },
  modalView: {
    margin: 10,
    backgroundColor: 'rgba(255,225,50,0.9)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',


  },
  button: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    marginTop: 30,
    elevation: 4,
  },
  buttonCancel: {
    alignItems:'center',
    paddingVertical:7,
    backgroundColor:'rgba(217, 121, 80, 0.8)',
    borderWidth:1.5, 
    borderBottomWidth:4,
    borderColor:'rgba(0, 0, 0, 0.7)', 
    borderRadius: 8,
  },
  buttonContinue: {
    alignItems:'center',
    paddingVertical:10,
    
    backgroundColor:'rgba(123, 168, 50, 0.8)',
    borderWidth:1.5, 
    borderBottomWidth:4,
    borderColor:'rgba(0, 0, 0, 0.7)', 
    borderRadius: 8,

  },





});