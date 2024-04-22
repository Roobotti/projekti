
import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Text from '../components/Text';

import { useContext } from 'react';

import { Game3dContext } from '../contexts/Game3dContext';

import * as Animatable from 'react-native-animatable';

export const ScoreOnline = () => {
    const {xp3D, level3D, streak3D, score} = useContext(Game3dContext)

    progressBarRef = useRef(null)
    levelRef = useRef(null)
    totalRef = useRef(null)
 
    const [level, setLevel] = useState(level3D)
    const [total, setTotal] = useState(score.total)

    const [width, setWidth] = useState(0)
    const [start, setStart] = useState(0)
    
    const nextLevelXp = (level) => level >= 0 ? 50*level**2+2000*level+500 : 0
    const nextXp = (level) => nextLevelXp(level) - nextLevelXp(level-1)

    const totalXp =  xp3D + total
    
    // level is still calculating ?
    useEffect( () => {
      setLevel(level3D)
    }, [level3D])

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
          levelRef.current.animate("bounce")
         }
         else {
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
            <Animatable.View ref={levelRef} style={{alignSelf: 'center'}}>
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
            <View style={{flex: 0.5, display:'flex', alignItems:'center', justifyContent:'flex-start'}}>
              
              <Animatable.View ref={totalRef}>
                <Text style={{fontSize: 40}}>
                  {total || "0"} xp
                </Text>
              </Animatable.View>
              
            </View>

            <LevelUp />
            

        </Animatable.View>
    )
  }


export const Score = () => {
    const {xp3D, level3D, streak3D, score} = useContext(Game3dContext)

    progressBarRef = useRef(null)
    levelRef = useRef(null)
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
          levelRef.current.animate("bounce")
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
            <Animatable.View ref={levelRef} style={{alignSelf: 'center'}}>
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
