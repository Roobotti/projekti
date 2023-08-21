import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';


import {ColorBlocks, Hint, PuzzleProve} from './Matrix';
import BlockRenderer, { BlockRendererLarge } from './Blocks';
import { Loading } from './Loading';

import { UserContext } from '../contexts/UserContext';

import * as Animatable from 'react-native-animatable';

import Text from './Text';

import { HourGlassTimer, LottieLoad } from '../lotties/Timers';
import { GameContext } from '../contexts/GameContext';
import { AssetsContext } from '../contexts/AssetsContext';

const colors = ["red", "green", "blue", "yellow"]

const MultiPlayer = () => {
  const {redEffect, greenEffect} = useContext(AssetsContext)
  const {friend, avatar} = useContext(UserContext)
  const { submitProve, sendRedy, sendContest, newGame, handleUbongoClick, isLoading, userReady, friendReady, gameOver, win, friendData, hintText, uboText, hintTimer, setHintTimer, contestTimer, proveTimer, puzzle, colored, setColored, color, setColor} = useContext(GameContext)

  const UbongoClicker = ({uboText}) => {
    return (
      <View>
        <TouchableOpacity style={styles.ubongo} onPress={handleUbongoClick}>
          <Text style={{fontSize:28}}>{uboText}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const WhoReady = () => {
    return(
      <View >
        { (!userReady && puzzle.blocks) 
          ? (
            <TouchableOpacity  onPress={sendRedy} style={{alignSelf:'stretch', padding:10,  backgroundColor:'rgba(235, 164, 33, 0.4)'}}>
              <Text style={{alignSelf: 'center'}}>Redy</Text>
            </TouchableOpacity>
            )
          : ( !friendReady && (<View>
              <LottieLoad
              />
              <Text style={styles.text} >Waiting for {friend}</Text>
            
            </View>) )
        }
        
      </View>
    )
  }

  const choseBlockRender = () => {
    return (
      friendReady && userReady ? <BlockRenderer blocks={puzzle.blocks} /> : <BlockRendererLarge blocks={puzzle.blocks} />
    )
  }

  if (win && proveTimer ) {
    return(
        <Animatable.View style={{flex:1, alignSelf:'stretch', justifyContent:'space-between', marginBottom:10}} animation={'fadeIn'} duration={1000}>
          <View style={{flex:1, alignSelf:'stretch', flexDirection:'row', justifyContent:'space-between'}}>
            <TouchableOpacity style={{...styles.touchBasic, alignSelf:'flex-start'}} onPress={() => submitProve()}>
              <Text style={styles.touchText}>
                Submit
              </Text>
            </TouchableOpacity>
            <Text style={{fontSize: 50}}>{proveTimer-1} s</Text>
          </View>
          <PuzzleProve matrix={colored} color={color} setColored={(c) => setColored(c)}/>
          <ColorBlocks colors={colors} color={color} setColor={(c) => setColor(c)} />
        </Animatable.View>

    )

  }

  if (gameOver) {
    const effect = win ? greenEffect : redEffect
    return( 
      <ImageBackground
        source={effect}
        resizeMode='stretch'
        style={{...styles.container, flex:1}}
      >
      <Animatable.View style={styles.winner_container} animation={'bounceIn'} duration={2000}>
        <Animatable.Text> 
          <Text style={{fontSize: 50}}>!!UBONGO!!</Text>
        </Animatable.Text>

        {win 
          ? (
            <View>
              {<Image source={{ uri: `data:image/jpeg;base64,${avatar}` }} style={styles.avatar} />}
              <Text style={styles.text} > You won! </Text>
              {contestTimer ? (
                <View>
                  <Text style={styles.text} >Waiting for contest</Text>
                  <Text style={styles.text} >{ contestTimer } s </Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.touchBasic} onPress={newGame}>
                  <Text  style={styles.touchText}>New game?</Text>
                </TouchableOpacity>
              )} 
              
            </View>
          )
          : (
            <View>
              {friendData && <Image source={{ uri: `data:image/jpeg;base64,${friendData.avatar}` }} style={styles.avatar} />}
              {proveTimer ? (
                  <View>
                        <Text style={styles.text} > {friend} is submiting the solution </Text>
                        <Text style={styles.text} > {proveTimer - 1} s </Text>
                  </View>
                ) : (
                  <View>
                      <Text style={styles.text} > {friend} won </Text>
                      <TouchableOpacity style={styles.touchBasic} onPress={newGame}>
                        <Text style={styles.touchText}>New game?</Text>
                      </TouchableOpacity>
                      
                      {contestTimer > 0 && <TouchableOpacity style={{...styles.ubongo, padding:15}} onPress={sendContest}>
                        <Text style={styles.touchText}>Contest in {contestTimer} s?</Text>
                      </TouchableOpacity>}
                  </View>
                )}
            </View>
            )
          }


      </Animatable.View>
      </ImageBackground>
    )
  }
  
  return (
    <View style={{flex:1}}>
      <Animatable.View>
        { puzzle?.blocks && choseBlockRender() }
        {isLoading 
          ? ( <Loading /> )
          : ( <WhoReady /> )
        }
      </Animatable.View>
      <View style={{flex:1, justifyContent:'center', marginBottom:120}}>
        {friendReady && userReady && (
          <View style={styles.container}> 
            <View 
              pointerEvents={hintTimer?"none":"auto"} 
              onTouchMove={() => setHintTimer(5)}
              onTouchEnd={() => setHintTimer(5)}
            >
              {puzzle?.solutions && <Hint matrix={puzzle.solutions[0]}/>}
            </View>
          </View>
        )}
      </View>
        {friendReady && userReady && <Animatable.View animation={'fadeIn'} duration={5000} delay={4000} style={{position:'absolute', alignSelf:'center', flexDirection: 'row', alignItems:'center', bottom:-10}}>
                  <UbongoClicker uboText={uboText} style={{alignSelf: 'center'}} />
                  <HourGlassTimer />
        </Animatable.View >}

        {friendReady && userReady && <Animatable.View 
          animation={'fadeIn'}
          duration={5000}
          delay={4000}
          style={styles.hint}
          >
          <Text style={{alignSelf: 'center'}}>{hintText}</Text>
        </Animatable.View>
        }
    </View>
    
  );
};

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
  text: {
    fontSize: 23,
    marginBottom: 20,
    alignSelf: 'center',
  },
  avatar: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 20,
    marginBottom: 50,
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
  }
});


export default MultiPlayer;

