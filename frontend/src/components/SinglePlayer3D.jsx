import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';

import { getPuzzle } from '../services/puzzle';

import Text from '../components/Text';

import Blocks3D from './Blocks3D';

import Matrix3D from './Matrix3D';
import { useContext } from 'react';

import { Game3dContext } from '../contexts/Game3dContext';

import * as Animatable from 'react-native-animatable';
import { zoomInUpBig } from './Animations';
import { useNavigate } from 'react-router-native';


const Score = () => {
    const {xp3D, level3D, streak3D, score} = useContext(Game3dContext)

    progressBarRef = useRef(null)
    rr = useRef(null)
    totalRef = useRef(null)

    const [animation, setAnimation] = useState(xp3D ? 0 : 1)
    const [level, setLevel] = useState(level3D)
    const [streak, setStreak] = useState(1)
    const [total, setTotal] = useState(0)

    const [width, setWidth] = useState(0)

    const [start, setStart] = useState(0)
    
    const nextLevelXp = (level) => level >= 0 ? 50*level**2+2000*level+500 : 0
    const nextXp = (level) => nextLevelXp(level) - nextLevelXp(level-1)

    const totalXp =  xp3D + total
    
    // level is still calculating ?
    useEffect( () => {
      setLevel(level3D)
    }, [level3D])

    // set the streak + 1
    useEffect( () => {
      if (animation > 2 && streak < streak3D){
        setStreak( s => s + 1)
        setTimeout( () => { setTotal(n => n + Math.floor(score.total/streak3D)) }, 10)
      }

    },[animation])

    //animate the progress bar
    useEffect(() => {
      if (progressBarRef.current) {
        const w = (nextLevelXp(level) > totalXp) ? (192 / nextXp(level)) * (totalXp - nextLevelXp(level-1)) : 192
        progressBarRef.current.animate({
          from: { width: start },
          to: { width: w },
          duration: 100,
          easing: "ease-in",
          useNativeDriver: true
          
      } ).then( () => {
         if (nextLevelXp(level) <= totalXp) {
          setStart(0)
          nextLevelXp(level) < totalXp ? setWidth(192) : setWidth(0)
          setLevel(n => n + 1) 
          rr.current.animate("bounce")
         }
         else {
          setAnimation(a => a + 1)
          setWidth(w)
          setStart(w)
         } 
        })
        
        
    }
    }, [totalXp, level]);

    useEffect(() => {
      if (totalRef.current) {
         totalRef.current.animate('pulse')
    }
    }, [total]);

    const LevelUp = () => {
        return (
          <View>
            <Animatable.View ref={rr} style={{alignSelf: 'center'}}>
              <Text style={{fontSize: 20}}>Level: {level}</Text>
            </Animatable.View>
            <TouchableOpacity onPress={() => setLevel(0)} style={{borderColor:'black', borderWidth:4, borderRadius:10 ,height:55, width:200, backgroundColor:'rgba(0,0,0,0.5)'}}>
              <Animatable.View 
                ref={progressBarRef}
                style={{ flex:1, borderRadius:6, backgroundColor:'rgba(255,225,50,0.5)', width:width}}>
 
              </Animatable.View>
            
            </TouchableOpacity>
            <Animatable.View style={{alignSelf: 'center'}}> 
              <Text style={{fontSize: 20}}>{Math.min(...[(totalXp - nextLevelXp(level-1)), nextXp(level)])} xp / {nextXp(level)} xp</Text>
            </Animatable.View>
          </View>
        )
    }
    
    return (
            <Animatable.View animation={'bounceIn'} style={{flex: 1, display:'flex', alignItems:'center', justifyContent:'space-around', margin:10}}>
            
            <Text style={{fontSize: 20 }}>Solve time: {score.time} s</Text>

            <View style={{flex: 0.5, display:'flex', alignItems:'center', justifyContent:'flex-start'}}>
              
              <Animatable.View ref={totalRef}>
                <Text style={{fontSize: 60}}>
                  {total} xp
                </Text>
              </Animatable.View>

              {(animation > 0) && 
                <Animatable.View 
                  animation={'tada'}
                  onAnimationBegin={() => setTotal(n => n + score.base)} 
                  delay={500}
                  style={{}}>
                    <Text style={{fontSize: 20}}>Base: {score.base} xp</Text>         
                </Animatable.View>
              }
              {(animation > 1) && 
              <Animatable.View 
                animation={'tada'}
                onAnimationBegin={() => setTimeout( () => {setTotal(n => n + score.speed)}, 50)} 
                delay={0}
                style={{}}>
                  <Text style={{fontSize: 20}}>Time: {score.speed} xp</Text>
              </Animatable.View>
              }
              
              {(animation > 2) && 
              <Animatable.View 
                  animation={'tada'}
                  onAnimationBegin={() => setStreak(1)}
                  style={{}}>
                    <Text style={{fontSize: 20}}>Streak: {streak} X </Text>      
                </Animatable.View>
                }
              
            </View>

            <LevelUp />
            

        </Animatable.View>
    )
  }

const SinglePlayer3D = () => {

  const [ puzzle, setPuzzle ] = useState({})
  const [ score, setScore ] = useState(false)

  const [isLoading, setIsLoading] = useState(false);

  const [menu, setMenu] = useState(false)
  const [next, setNext] = useState(false)

  const navigate = useNavigate()
  const { allValid, visibleTop, setVisibleTop, setBlocks} = useContext(Game3dContext)

  useEffect( () => {
    getData()
  },[])
  
  useEffect( () => {
    if (puzzle?.blocks) {
       setBlocks(puzzle.blocks)
    }

  },[puzzle])

  gameRef = useRef(null)

  useEffect(() => {
    if (gameRef.current && allValid){
      gameRef.current.animate('fadeOut').then( () => setTimeout( () => { setScore(true) }, 10))
      
    }
  }, [allValid])

  const getData = async () => {
    try {
      if (score) setScore(false)
      setPuzzle({})
      setIsLoading(true)
      const response = await getPuzzle()
      setPuzzle({blocks: response.blocks, solutions: response.solutions })
      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const NewBoard = () => {
    return(
      <TouchableOpacity onPress={() => setNext(true)} style={styles.newBoard}>
        <Text style={styles.text}>New board</Text>
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

  const Game = () => {
    const [layer, setLayer] = useState(visibleTop ? " Hide " : "Show")

    const TopLayer = () => {
      return (
          <TouchableOpacity onPress={() => {setVisibleTop(t => !t); setLayer(l => l == " Hide " ? "Show" : " Hide ")}} style={{...styles.topLayer, backgroundColor: (layer==" Hide " ? 'rgba(217, 121, 80, 0.5)' : 'rgba(217, 121, 80, 0.3)')}} >
            <Text style={styles.text}>
              {layer}
            </Text>
          </TouchableOpacity>
      )
    }

    return (
      <View style={styles.gameContainer} >

        <Animatable.View animation={zoomInUpBig} style={{flex: 1, display:'flex', justifyContent:'center', zIndex:2}}>
          {puzzle?.solutions && <Matrix3D matrix={puzzle.solutions[0]}/>} 
        </Animatable.View>

        <View style={{}}>
          {puzzle?.blocks && 
              <View>
                <TopLayer />
                <Animatable.View animation={'fadeInUpBig'} delay={300} style={styles.blocksContainer}>
                  <Blocks3D blocks={puzzle.blocks}/>
                </Animatable.View>
              </View>
            
          }
        </View>

    </View>
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
            <TouchableOpacity
              style={[styles.button, styles.buttonContinue]}
              onPress={() => {
                setMenu(false); 
                setNext(false)
              }}>
              <Text style={styles.text}>Keep going</Text>
            </TouchableOpacity>
            {menu && (
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setMenu(false)
                  navigate("/", { replace: true })
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
            
          </View>
        </View>
      </Modal>
    )
  }

  const GameState = useMemo(() => {
  //animation={'zoomOut'} delay={3000} onAnimationEnd={() => setScore(true)
    return(
      <View style={{flex:1}}>
        <View style={{height:60}} >
          <View style={styles.navigationBar}>
            <Menu/>
            <NewBoard/>
          </View>
        </View>
        
        {!score && 
        <Animatable.View ref={gameRef} delay={100} style={{flex:1}} >
          <Game />
        </Animatable.View>}
        
        {score && 
          <Animatable.View animation={'bounceIn'} delay={100} style={{flex:1}} >
            <Score />
          </Animatable.View>}
      </View>
    )
    

  }, [isLoading, score]);

  const GameAndModal = useMemo(() => {
    return (
      <View style={{flex:1}}>
        <MyModal/>
        {GameState}
      </View>
    )
  }, [isLoading, score, next, menu])

  return GameAndModal
    
};

export default SinglePlayer3D;

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