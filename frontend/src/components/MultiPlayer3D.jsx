import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';



import { Loading } from './Loading';

import { UserContext } from '../contexts/UserContext';

import * as Animatable from 'react-native-animatable';

import Text from './Text';

import { LottieLoad } from '../lotties/Timers';
import { AssetsContext } from '../contexts/AssetsContext';
import Blocks3D from './Blocks3D';
import { Online3DContext } from '../contexts/Online3DContext';
import { Game3dContext } from '../contexts/Game3dContext';
import Matrix3D from './Matrix3D';
import { zoomInUpBig } from './Animations';
import { ScoreOnline } from './Score';
import MyModal from './MyModal';

const colors = ["red", "green", "blue", "yellow"]

const MultiPlayer3D = () => {
  const {redEffect, greenEffect} = useContext(AssetsContext)
  const {friend, avatar} = useContext(UserContext)
  const { sendRedy, newGame, sendUbongo, giveUp, isLoading, userReady, friendReady, gameOver, win, friendData, puzzle, friendGaveUp, userGaveUp } = useContext(Online3DContext)
  
  const [menu, setMenu] = useState(false)
  const [giveUpModal, setGiveUpModal] = useState(false)

  const [clicks, setClicks] = useState(0)

  const [ score, setScore ] = useState(false)
  
  const { allValid, visibleTop, setVisibleTop, setBlocks, setOnline } = useContext(Game3dContext)
    
  gameRef = useRef(null)

  useEffect( () => {
    setOnline(true)
    setScore(false)
    setClicks(0)
  },[])
  
  useEffect( () => {
    if (puzzle?.blocks) {
      setBlocks(puzzle.blocks)
      setClicks(0)
    }
  },[puzzle])

  useEffect( () => {
    if (allValid) {sendUbongo()}
  },[allValid])

  // animate the game ref
  useEffect(() => {
    if (gameRef.current && gameOver){
      gameRef.current.animate('fadeOut').then( () => setTimeout( () => { setScore(true) }, 10))
    }
  }, [gameOver])
  


  const WhoReady = () => {
    return(
      <View>
        <View style={styles.readyContainer}>
          {!userReady
            ? (
              <TouchableOpacity  onPress={sendRedy} style={styles.ready}>
                <Text style={styles.text}>Redy?</Text>
              </TouchableOpacity>
              )
             
            : (!friendReady ? (<View>
                <LottieLoad
                />
                <Text style={styles.text} >Waiting for {friend}</Text>
              
              </View>) : null
            )}
        </View>
      </View>
    )
  }

  const NavigationBar = () => {
    const GiveUp =() => {
      return(
        <TouchableOpacity onPress={() => userGaveUp ? setClicks(c => c+1) : setGiveUpModal(true) } style={{...styles.newBoard, backgroundColor:((friendGaveUp) ? 'rgba(0, 255, 0, 0.4)' : (userGaveUp ? `rgba(${255-clicks*2}, 0, 0, 0.4)` : 'rgba(217, 121, 80, 0.6)'))}}>
          <Text style={styles.text}>{clicks < 100 ? (clicks ? ("Give up " + clicks + "X") :"Give up") : ((clicks<113) ? ["Stop.", "Stop it!", "):", "Just try", "Not this", "The puzzle", "Ok", "Happy?", "Stop.", "Stop it!", "Are you..", "Never mind", "I help u"][clicks-100] : BackHandler.exitApp() ? "113 clicks just" : "WHY?")}</Text>
        </TouchableOpacity>
      )
    }

    const Menu = () => {
      return(
        <TouchableOpacity onPress={() => setMenu(true)} style={styles.menu}>
          <Text style={styles.text}>Menu</Text>
        </TouchableOpacity>
      )
    }

    const NewGame = () => {
      return(
        <TouchableOpacity 
          onPress={newGame} 
          style={styles.newBoard}>
          <Text style={styles.text}>New game</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={{height:60}} >
          <View style={styles.navigationBar}>
            <Menu/>
            {(friendReady && !gameOver) ? <GiveUp/> : null}
            {gameOver ? <NewGame/> : null}
          </View>
      </View>

    )
  }


  const Game = () => {
    const [layer, setLayer] = useState(visibleTop ? " Hide " : "Show")
    const [opacity, setOpacity] = useState(0)

    const TopLayer = () => {
      return (
          <TouchableOpacity 
            onPress={() => {setVisibleTop(t => !t); setLayer(l => l == " Hide " ? "Show" : " Hide ")}} 
            style={{...styles.topLayer, 
              backgroundColor: (layer==" Hide " ? 'rgba(217, 121, 80, 0.5)' : 'rgba(217, 121, 80, 0.3)'),
              opacity:opacity
              }
            } >
            <Text style={styles.text}>
              {layer}
            </Text>
          </TouchableOpacity>
      )
    }

    return (
      <View style={styles.gameContainer} >
        <Animatable.View animation={zoomInUpBig} onAnimationEnd={() => setOpacity(1)} style={{flex: 1, display:'flex', justifyContent:'center', zIndex:2}}>
          {puzzle?.solutions.length ? <Matrix3D matrix={puzzle.solutions[0]}/> : null} 
        </Animatable.View>

        <View style={{}}>
          {puzzle?.blocks 
            ? (
              <View>
                <TopLayer />
                <Animatable.View animation={'fadeInUpBig'} delay={300} style={styles.blocksContainer}>
                  <Blocks3D blocks={puzzle.blocks}/>
                </Animatable.View>
              </View>
            )
            : null
          }
        </View>

    </View>
    )
  } 

  const GameState = useMemo(() => {
    return(
      <View style={{flex:1}}>
        {!score 
          ? (
            <Animatable.View ref={gameRef} delay={100} style={{flex:1}} >
              <Game />
            </Animatable.View>
          )
          : null
        }

      </View>
    )
    }, [isLoading, score, puzzle]);


  const GameOverView = useMemo(() => {
    const effect = win ? greenEffect : redEffect
    if (gameOver) {
      return( 
      <ImageBackground
        source={effect}
        resizeMode='cover'
        style={{ flex:1, justifyContent: 'center'}}
      >
      <Animatable.View style={styles.winner_container} animation={'bounceIn'} duration={2000}>
        {win 
          ? (
            <View>
              {<Image source={{ uri: `data:image/jpeg;base64,${avatar}` }} style={styles.avatar} />}
              <Text style={styles.text} > You won! </Text>
            </View>
          )
          : (
            <View>
              {friendData ? <Image source={{ uri: `data:image/jpeg;base64,${friendData.avatar}` }} style={styles.avatar} /> : null}  
                <Text style={styles.text} > {friend} won </Text>
            </View>
            )
          }

        <ScoreOnline />
      </Animatable.View>
      </ImageBackground>
    )
  }

  },[gameOver])
    
  const GameView = useMemo(() => {
    return (
      <View style={{flex:1}}>

        <Animatable.View style= {{flex:1}}>
          { (friendReady && puzzle?.blocks) ? GameState : null}
          
          {isLoading 
            ? ( <Loading /> )
            : ( <WhoReady /> )
          }
        </Animatable.View>
        
        </View>
      
    );

    },[puzzle, userReady, friendReady, isLoading])
  
  
  const GameAndModal = useMemo(() => {
      return (
        <View style={{flex:1}}>
          {giveUpModal ? <MyModal Info={`New game will start${friendGaveUp ? '!' : ` if ${friend} gives up too`} `} ContinueText="Give up" CancelText="Keep going" ContinueTask={() => giveUp()} SetHide={setGiveUpModal}/> : null}
          {menu ? <MyModal To='/Lobby' SetHide={setMenu}/> : null}
          
          {gameOver
            ? GameOverView 
            : GameView
          }
        </View>
      )
    }, [isLoading, score, menu, gameOver, userReady, friendReady, puzzle, giveUpModal])

  const final = useMemo(() => {{
    return(
      <View style={{flex:1}}>
        <NavigationBar/>
        {GameAndModal}
      </View>
    )

  }}, [isLoading, score, menu, gameOver, userReady, friendReady, puzzle, giveUpModal, friendGaveUp, userGaveUp, clicks])
  return final
};

export default MultiPlayer3D;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',

  },
  ubongo: {
    margin: 20,
    padding: 30,
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: 5,
    borderColor: 'black',
    backgroundColor: 'rgba(255, 196, 87, 0.2)',
    borderRadius: 20,
  },
  touchBasic: {
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: 5,
    borderColor: 'black',
    backgroundColor: 'rgba(255, 196, 87, 0.2)',
    borderRadius: 20, 
    padding:15, 
    margin:5
  },
  touchText: {
    fontSize: 23,
    marginBottom: 0,
    alignSelf: 'center',
  },
  winner_container: {
    flex: 1,
    alignItems: 'center',
    margin: 40,
  },
  avatar: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 20,
    marginBottom: 20,
  },
  hint: {
    position:'absolute',
    top: 120,
    right: 10,
    transform: [{rotate: '30deg'}],
    alignSelf: 'center',
    alignSelf:'stretch', 
    padding:10, 
    backgroundColor:'rgba(121, 217, 80, 0.3)',
    borderRadius: 6,
  },
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
    flex:1,

    alignItems:'center',
    paddingVertical:7,
    backgroundColor:'rgba(217, 121, 80, 0.6)',
    borderWidth:1.5, 
    borderBottomWidth:4,
    borderRightWidth:2,
    borderColor:'rgba(0, 0, 0, 0.7)', 
    borderRadius: 8,

  },

  readyContainer : {
    position:'absolute',
    top:200,
    right:0,
    left:0,
    margin:'auto'
    
  },
  ready : {
    alignSelf:'center',
    alignItems:'center',
    padding:40,
    paddingVertical:20,
    backgroundColor:'rgba(123, 168, 50, 0.5)',
    borderWidth:2.5, 
    borderBottomWidth:6,
    borderRightWidth:4,
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

   text: {fontSize:20, alignSelf:'center'},

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
    marginTop: 30,
    backgroundColor:'rgba(123, 168, 50, 0.8)',
    borderWidth:1.5, 
    borderBottomWidth:4,
    borderColor:'rgba(0, 0, 0, 0.7)', 
    borderRadius: 8,

  },
});




