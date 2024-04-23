

import React, { useEffect, useContext, useState, useMemo } from 'react';

import { Dimensions, Modal } from 'react-native';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
} from 'react-native';

//import for the animation of Collapse and Expand
import * as Animatable from 'react-native-animatable';


//import for the Accordion view
import Accordion from 'react-native-collapsible/Accordion';

import { UserContext } from '../contexts/UserContext';
import Text from './Text';


import { loadFriend, loadFriendData, sendDeleteFriend, sendDeleteRequest, sendDeleteSentRequest, sendRequest } from '../services/users';

import { socket } from '../services/socket';
import FriendProfile from './Friend';
import { Loading, LoadingSmall } from './Loading';

import { useNavigate } from 'react-router-native';


const { width } = Dimensions.get('window');
const windowWidth = width;


export const LobbyCollap = () => {
  const { user, friends, requests, token, sentRequests, wins, invites, setFriend, setSentInvite, setReFresh, setFriends, setRequests, setInvites, setSentRequests } = useContext(UserContext);
  const [newFriend, setNewFriend] = useState("");
  const [profile, setProfile] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
    // Ddefault active selector
  const [activeSections, setActiveSections] = useState([]);

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const [modal, setModal] = useState("")

  const navigate = useNavigate()

  
  //message timeout
  useEffect(() => {
    if (message) { setTimeout( () => setMessage(null), 2000)}
  }, [message])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setReFresh(Math.random())
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const CONTENT =  [
    //invites
    {
      empty: invites.length,
      title: `Invites (${invites.length})`,
      content:
        <View  style={styles.map_container}>
            {invites && invites.map((i) => (
              <View key={i.username} style={styles.user_container}>
                <Image source={{ uri: `data:image/*;base64,${i.avatar}` }} style={styles.avatar}/>
                <Text styles={{textAlign: 'center'}}>{i.username}</Text>
                <TouchableOpacity style={styles.add} onPress={() => handleJoin(i.username)} >
                  <Text>Join</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
    },
    
    //friends
    {
      empty: friends.length,
      title: `Friends (${friends.length})`,
      content:
          <View  style={styles.map_container}>
          {friends && friends.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
                <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }} style={styles.avatar}/>
                <TouchableOpacity style={{...styles.add, backgroundColor:'rgba(64, 223, 255, 0.6)'}} onPress={() => handleProfile(friend.username)} >
                  <Text>{friend.username}</Text>
                </TouchableOpacity>
                {(invites && invites.map((i) => i.username).includes(friend.username))
                  ? (
                    <TouchableOpacity style={styles.add} onPress={() => handleJoin(friend.username)} >
                      <Text>Join</Text>
                    </TouchableOpacity>
                  ) 
                  :(
                    <TouchableOpacity style={styles.add} onPress={() => setModal(friend.username)} >
                      <Text>Host</Text>
                    </TouchableOpacity>
                  )
                }
            </View>
          ))}
        </View>
    },

    //friend requests
    {
      empty: requests.length,
      title: `Friend requests (${requests.length})`,
      content:(
        <View  style={styles.map_container}>
          {requests && requests.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
                <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }} style={styles.avatar}/>
                <Text style={{alignSelf:'center'}}>{friend.username}</Text>
                <TouchableOpacity style={styles.add} onPress={() => handleAccept(friend.username)} >
                  <Text>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.delete} onPress={() => handleDeleteRequest(friend.username)} >
                  <Text>Delete</Text>
                </TouchableOpacity>
            </View>
          ))}
        </View>
      )
    },

    //Sent requests
    {
      empty: sentRequests.length,
      title: `Sent requests (${sentRequests.length})`,
      content:
        (
        <View style={styles.map_container}>
          {sentRequests && sentRequests.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
              <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }} style={styles.avatar}/>
              <Text style={{alignSelf:'center'}}>{friend.username}</Text>
              <TouchableOpacity style={styles.delete} onPress={() => handleDeleteSentRequest(friend.username)} >
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )
    },
  ]



  const handleInvite = async (friend) => {
    console.log("invite", user, friend)
    socket.emit("invite", {"user":user, "friend":friend});
    setSentInvite(friend)
    setFriend(friend)
    //setGame(<MultiPlayer/>)
  };

  const MyModal = ()  => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal !== ""}
        onRequestClose={() => setModal("")}
        on
        >
          <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.text}>Host:</Text>
            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
              <TouchableOpacity
                style={[styles.button, styles.buttonContinue]}
                onPress={() => {
                  handleInvite(modal)
                  setModal("")
                  navigate("/MultiPlayer3D", { replace: true })
                }}>
                <Text style={styles.text}>3D</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.buttonContinue]}
                onPress={() => {
                  handleInvite(modal)
                  setModal("")
                  navigate("/MultiPlayer", { replace: true })
                }
                }>
                <Text style={styles.text}>classic</Text>
              </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setModal("")
                }
                }>
                <Text style={styles.text}>cancel</Text>
              </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
    )
  }

  const handleJoin = (friend) => {
    console.log("join")
    setFriend(friend)
    
    //setGame(<MultiPlayer/>)
    navigate("/MultiPlayer3D", { replace: true })
  };

  const handleProfile = (friend) => {
    console.log("to friend profile", friend)
    setProfile(<FriendProfile friend={friend} onDelete={() => { 
      handleDeleteFriend(friend) 
      setProfile(null)
    }} onBack={(v) => setProfile(v)}/>)
  }

  const handleAccept = async (friend) => {
    sendRequest(token, friend)
    setRequests(requests.filter((f) => f.username !== friend))
    socket.emit('accept', {"user":user, "friend":friend});
    const data = await loadFriend(friend)
    const json = await data.json()
    console.log("Accept")
    setFriends([...friends, await json])
  };

  const handleAddFriend = async () => {
    console.log("tok:", token)
    setLoading(true)
    if (friends.map((f) => f.username).includes(newFriend) || sentRequests.map((f) => f.username).includes(newFriend) || newFriend === user) {
      setMessage(`You have alredy sent request to: "${newFriend}"`)
      setLoading(false)
      return null
    }
    if (requests.map((f) => f.username).includes(newFriend)) return handleAccept(newFriend)

    try {
      socket.emit('request', {"user":user, "friend": newFriend})
      const data = await loadFriend(newFriend)
      const friend = data.json()
      await setSentRequests([...sentRequests, await friend])
      await sendRequest(token, newFriend)
      setLoading(false)
      
    } catch (error) {
      setMessage(`There is no user: "${newFriend}"`)
      setLoading(false)
    }

  }

  const handleDeleteFriend = (friend) => {
    console.log("Deleted")
    setFriends(friends.filter((f) => f.username !== friend))
    sendDeleteFriend(token, friend)
  }

  const handleDeleteSentRequest = (friend) => {
    console.log("Deleted")
    setSentRequests(sentRequests.filter((f) => f.username !== friend))
    sendDeleteSentRequest(token, friend)
    //setActiveSections([])

  }

  const handleDeleteRequest = (friend) => {
    console.log("Deleted")
    setRequests(requests.filter((f) => f.username !== friend))
    sendDeleteRequest(token, friend)
  }

  if (profile) return profile

  const setSections = (sections) => {
    //setting up a active section state
    setActiveSections(sections);
  };


  const renderContent = (section) => {
    return (
      <Animatable.View style={styles.content}>
        {section.content}
      </Animatable.View>
    );
  };

  const renderHeader = (section, _, isActive) => {
    //Accordion Header view
    if (!section.empty) return <></>
    
    return (
      <Animatable.View>
        <Animatable.View
          duration={400}
          style={[styles.header, isActive ? styles.active : styles.inactive]}
          transition="backgroundColor">
          <Text style={styles.headerText}>{section.title}</Text>
        </Animatable.View>
        {isActive && renderContent(section, isActive)}
      </Animatable.View>
    );
  };

  return (
      <View style={styles.container}>
        <MyModal />
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
          <TextInput
            style={styles.input}
            value={newFriend}
            onChangeText={(text) => setNewFriend(text)}
            placeholder="Add new friend"
            returnKeyType="done" 
            onSubmitEditing={() => handleAddFriend()}
          />
          {loading && <LoadingSmall/>}
          {message && <Text style={styles.message}> {message} </Text>}

          
          <Accordion
            sections={CONTENT}
            activeSections={activeSections}
            
            //title and content of accordion
            touchableComponent={TouchableOpacity}

            expandMultiple={false}

            renderHeader={renderHeader}
            //Header Component(View) to render
            renderContent={() => <></>}
            //Content Component(View) to render
            duration={400}
            //Duration for Collapse and expand
            onChange={setSections}
            //setting the state of active sections
          
          />
        </ScrollView>
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'stretch',
    paddingTop: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 30,
  },
  header: {
    alignSelf:'center',
    backgroundColor: 'transparent',
    //marginVertical:15,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    padding:10,
    paddingHorizontal:20,
    paddingTop:15,

    backgroundColor: 'rgba(0,0,0,0.1)',
    borderColor: 'black',
    borderWidth: 4,
    borderRadius: 10,

    marginVertical:10,
  },
  content: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    
  },
  active: {
    alignSelf:'stretch',
    backgroundColor: 'transparent',
    marginHorizontal:10,
  },
  inactive: {
    alignSelf:'stretch',
    backgroundColor: 'transparent',
    
    marginHorizontal:40

  },
  input: {
    fontFamily:"FreckleFace",
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderWidth: 5,
    borderColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    marginHorizontal: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  user_container: {
    flex:1,
    flexDirection: 'row',
    textAlignVertical: 'center',
    justifyContent: 'space-evenly',
    padding:10,

    backgroundColor: 'rgba(0,0,0,0.1)',
    borderWidth: 5,
    borderColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    

    //backgroundColor:'blue',
    
  },
  map_container: {
    display: 'flex',
    flex: 1,
    //backgroundColor:'red',
    
    width: windowWidth-20,
    gap: 20,
    
    padding: 10,
  },

  add: {
    alignSelf: 'center',
    backgroundColor: 'rgba(50, 199, 0, 0.6 )',
    padding: 15,
    borderRadius: 20,
  },
  delete: {
    alignSelf: 'center',
    backgroundColor: 'rgba(250, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 20,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#f9c2ff',
    textAlign: 'center'
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
    marginTop: 30,
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
    width: 100,
  },

});
