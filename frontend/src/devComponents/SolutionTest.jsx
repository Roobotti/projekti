import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, PanResponder, Animated, ImageBackground } from 'react-native';

import { getPuzzle } from '../services/puzzle';

import Text from '../components/Text';

import { Hint } from '../components/Matrix';
import { DevSolution } from './devMatrix';
import BlockRenderer from '../components/Blocks';
import { Loading } from '../components/Loading';
import { debounce, min, pad } from 'lodash';

import * as Animatable from 'react-native-animatable';
import { GLView } from 'expo-gl';
import {  Canvas, Box } from '@react-three/fiber/native';

import useControls from "r3f-native-orbitcontrols"
import { useContext } from 'react';

import { UserContext } from '../contexts/UserContext';
import { Game3dContext } from '../contexts/Game3dContext';
import { AssetsContext } from '../contexts/AssetsContext';

const DEG45 = Math.PI / 4;

const DevTest1 = () => {

  const [ puzzle, setPuzzle ] = useState({})

  const [isLoading, setIsLoading] = useState(false);
  const [hintText, setHintText] = useState('Hint availabe') 
  const [hintTimer, setHintTimer] = useState(0)
  const [solution, setSolution] = useState(0)

  useEffect( () => {
    getData()
  },[])

  useEffect( () => {
    setHintText(hintTimer?`   Next in ${hintTimer} s   `:'Hint available')
    if ( hintTimer > 0) {
      const interval = setInterval( () => {
        setHintTimer( c => c - 1)
      }, 1000);
      return () => {
        clearInterval(interval);
      };
  }

  }, [hintTimer])

  const getData = async () => {
    try {
      setPuzzle({})
      setIsLoading(true)
      const response = await getPuzzle()
      setPuzzle({blocks: response.blocks, solutions: response.solutions })
      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNextSolution = (n) => {
    puzzle.solutions.length - solution ? setSolution(solution + n) : setSolution(0)
  }

  const handleTouchStart = () => {
    setHintTimer(5)
    debounceSetTimer()
  }
  const debounceSetTimer = debounce(() => { setHintTimer(5)}, 1000); 

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={getData} style={{alignSelf:'stretch', padding:10,  backgroundColor:'rgba(217, 121, 80, 0.5)'}}>
        <Text style={{alignSelf: 'center'}}>New board</Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
        <TouchableOpacity onPress={() => handleNextSolution(1)} style={{alignSelf:'stretch', padding:10,  backgroundColor:'rgba(217, 121, 80, 0.5)'}}>
            <Text style={{alignSelf: 'center'}}>
              Next solution {puzzle?.solutions?.length - solution} 
            </Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1, display:'flex', justifyContent:'center', marginBottom:100}}>
        {solution 
          ? (
            <View> 
              {puzzle?.solutions && <DevSolution matrix={puzzle.solutions[solution - 1]}/>} 
            </View>
          )
          : (
            <View pointerEvents={hintTimer?"none":"auto"} onTouchStart={handleTouchStart}>
              {puzzle?.solutions && <Hint matrix={puzzle.solutions[0]}/>}
            </View>
          )
        }
      </View>

      <View style={{position:'absolute', bottom:5}}>
        {isLoading 
          ? ( <Loading /> )
          : ( puzzle?.blocks && <BlockRenderer blocks={puzzle.blocks}/> )
        }
      </View>

      {puzzle && <Animatable.View 
        animation={'fadeIn'}
        duration={3000}
        style={{
          position:'absolute',
          top: 70,
          right: 10,
          transform: [{rotate: '30deg'}],
          alignSelf: 'center',
          alignSelf:'stretch', 
          padding:10, 
          backgroundColor:'rgba(121, 217, 80, 0.3)',
          borderRadius: 6,
        }}
        >
        <Text style={{alignSelf: 'center'}}>{hintText}</Text>
      </Animatable.View>
      }

    </View>
  );
};


//orbit control
const DevTest2 = () => {
  const [OrbitControls, events] = useControls()
	return (
    <View style={{flex: 1}} {...events}>
			<Canvas>
				<OrbitControls />

				<mesh>
					<boxGeometry />
					<meshBasicMaterial color={0xff0000} wireframe />
				</mesh>
			</Canvas>
      </View>
	);
}

// sp 3d score
const DevTest = () => {
    const {xp3D, level3D, streak3D, score, setValidBlocks} = useContext(Game3dContext)

    progressBarRef = useRef(null)
    rr = useRef(null)
    totalRef = useRef(null)

    const [animation, setAnimation] = useState(xp3D ? 0 : 1)
    const [level, setLevel] = useState(level3D)
    const [streak, setStreak] = useState(1)
    const [next, setNext] = useState(false)
    const [total, setTotal] = useState(0)

    const [width, setWidth] = useState(0)

    const [start, setStart] = useState(0)
    
    const nextLevelXp = (level) => level >= 0 ? 50*level**2+2000*level+500 : 0
    const nextXp = (level) => nextLevelXp(level) - nextLevelXp(level-1)

    const totalXp =  xp3D + total
    
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

    useEffect( () => {
      if (next) {
        setValidBlocks([1])
        setTotal(0)
        setStreak(1)
        setLevel(level3D)
        setWidth(0)
        setStart(0)
        setAnimation(xp3D ? 0 : 1)
      }
      else {
        setValidBlocks([])
      }
    }, [next])


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
              <Text style={{fontSize: 20}}>{min([(totalXp - nextLevelXp(level-1)), nextXp(level)])} xp / {nextXp(level)} xp</Text>
            </Animatable.View>
          </View>
        )
    }
    
    return (
        <View style={{flex: 1, display:'flex'}}>
          <TouchableOpacity onPress={() => setNext(n => !n) } style={{alignSelf:'center', backgroundColor:'rgba(0,0,0,0.08)', borderWidth:4, borderColor:'black', borderRadius:8, margin:10}}>
              <Text style={{margin:10}}>NEXT</Text>
          </TouchableOpacity>
          { next &&
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
        }
      </View>
    )
  }


const DevTest4 = () => {
  
}

export default DevTest;
