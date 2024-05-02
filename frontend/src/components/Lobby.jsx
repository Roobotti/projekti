

import React, { useEffect, useContext, useState } from 'react';

import { Dimensions, Modal } from 'react-native';

import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  TouchableOpacity,
  TextInput,
  Image
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

import { useLocation, useNavigate } from 'react-router-native';


const { width } = Dimensions.get('window');
const windowWidth = width;


export const LobbyCollap = () => {
  const { user, friends, requests, token, sentRequests, wins, invites, setFriend, setSentInvite, setReFresh, setFriends, setRequests, setInvites, setSentRequests } = useContext(UserContext);
  const [newFriend, setNewFriend] = useState("");
  const [profile, setProfile] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
  const [activeSections, setActiveSections] = useState([]);

  const [loading, setLoading] = useState(false)
  const [loadingFriend, setLoadingFriend] = useState(false)
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
      empty: !invites.length,
      title: `Invites (${invites.length})`,
      content:
        <TouchableOpacity style={styles.map_container} activeOpacity={1} onPress={() => null}>
            {invites && invites.map((i) => (
              <View key={i.username} style={styles.user_container}>
                <Image source={{ uri: `data:image/*;base64,${i.avatar}` }} style={styles.avatar}/>
                <View style={{flex:1,alignItems:'flex-end'}}><Text>{i.username}</Text></View>
                <TouchableOpacity style={styles.add} onPress={() => handleJoin(i.username, i.mode)} >
                  <Text>Join {i.mode}</Text>
                </TouchableOpacity>
              </View>
            ))}
        </TouchableOpacity>
    },
    
    //friends
    {
      empty: !friends.length,
      title: `Friends (${friends.length})`,
      content:
          <TouchableOpacity style={styles.map_container} activeOpacity={1} onPress={() => null}>
          {friends && friends.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
                <TouchableOpacity onPress={() => handleProfile(friend.username)}>
                  <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }}  style={styles.avatar}/>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.add, backgroundColor:'rgba(64, 223, 255, 0.6)'}} onPress={() => handleProfile(friend.username)} >
                  <Text>{friend.username}</Text>
                </TouchableOpacity>
                {(invites && invites.find((i) => i.username === friend.username))
                  ? (
                    <TouchableOpacity style={styles.add} onPress={() => handleJoin(friend.username, invites.find((i) => i.username === friend.username).mode)} >
                      <Text>Join {invites.find((i) => i.username === friend.username).mode}</Text>
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
          {loadingFriend && 
            <View style={styles.user_container}>
              <LoadingSmall />
            </View>
          }
        </TouchableOpacity>
    },

    //friend requests
    {
      empty: !requests.length,
      title: `Friend requests (${requests.length})`,
      content:(
        <TouchableOpacity style={styles.map_container} activeOpacity={1} onPress={() => null}>
          {requests && requests.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
                <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }} style={styles.avatar}/>
                
                <View style={{ flex:1}}>
                <Text style={styles.text}>{friend.username}</Text>
                
                  <View style={{flexDirection:'row', gap:4}}>
                    <TouchableOpacity style={styles.add} onPress={() => handleAccept(friend.username)} >
                      <Text style={styles.text}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.delete} onPress={() => handleDeleteRequest(friend.username)} >
                      <Text style={styles.text}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>

            </View>
          ))}
        </TouchableOpacity>
      )
    },

    //Sent requests
    {
      empty: !sentRequests.length,
      title: `Sent requests (${sentRequests.length})`,
      content:
        (
        <TouchableOpacity style={styles.map_container} activeOpacity={1} onPress={() => null}>
          {sentRequests && sentRequests.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
              <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }} style={styles.avatar}/>
              <View style={{flex:1}}>
                <Text style={styles.text}>{friend.username}</Text>
                <View style={{flex:0.5, flexDirection:'row'}}>
                  <TouchableOpacity style={{...styles.delete, marginHorizontal:40}} onPress={() => handleDeleteSentRequest(friend.username)} >
                    <Text style={styles.text}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </TouchableOpacity>
      )
    },
  ]

  const handleInvite = async (friend, mode) => {
    socket.emit("invite", {"user":user, "friend":friend, "mode":mode});
    setSentInvite(friend)
    setFriend(friend)
  };

  const HostModal = ()  => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal !== ""}
        onRequestClose={() => setModal("")}
        >
          <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.text}>Host:</Text>
            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
              <TouchableOpacity
                style={[styles.button, styles.buttonContinue]}
                onPress={() => {
                  handleInvite(modal, "3D")
                  setModal("")
                  navigate("/MultiPlayer3D", { replace: true })
                }}>
                <Text style={styles.text}>3D</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.buttonContinue]}
                onPress={() => {
                  handleInvite(modal, "2D")
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
  };

  const handleJoin = (friend, mode) => {
    setFriend(friend)
    navigate((mode === "3D") ? "/MultiPlayer3D" : "/MultiPlayer", { replace: true })
  };

  const handleProfile = (friend) => {
    navigate("/Friend", { replace: true , state: {friend}})

    setProfile(<FriendProfile friend={friend} onDelete={() => { 
      handleDeleteFriend(friend) 
      setProfile(null)
    }} onBack={(v) => setProfile(v)}/>)
  }

  const handleAccept = async (friend) => {
    setLoadingFriend(true)
    try {
      sendRequest(token, friend)
      setRequests(requests.filter((f) => f.username !== friend))
      socket.emit('accept', {"user":user, "friend":friend});
      const data = await loadFriend(friend)
      const json = await data.json()
      await setFriends([...friends, await json])
      setLoadingFriend(false)
      }
      
    catch (error) {
      setMessage(`There is no user: "${friend}"`)
      setLoadingFriend(false)
    }
  };

  const handleAddFriend = async () => {
    setLoading(true)

    if (newFriend === user) {
      setMessage(`You can't add yourself`)
      setLoading(false)
      return null
    }
    if (sentRequests.map((f) => f.username).includes(newFriend)) {
      setMessage(`You have alredy sent request to: "${newFriend}"`)
      setLoading(false)
      return null
    }
    if (friends.map((f) => f.username).includes(newFriend)) {
      setMessage(`User "${newFriend}" is allready your friend`)
      setLoading(false)
      return null
    }

    if (requests.map((f) => f.username).includes(newFriend)){
      setMessage(`Added "${newFriend}" from friend requests`)
      handleAccept(newFriend)
      return  null
    }

    try {
      socket.emit('request', {"user":user, "friend": newFriend})
      const data = await loadFriend(newFriend)
      const friend = data.json()
      setMessage(`Friend request sended to "${newFriend}"`)
      await setSentRequests([...sentRequests, await friend])
      await sendRequest(token, newFriend)
      setLoading(false)
      
    } catch (error) {
      setMessage(`There is no user: "${newFriend}"`)
      setLoading(false)
    }

  }

  const handleDeleteSentRequest = (friend) => {
    setSentRequests(sentRequests.filter((f) => f.username !== friend))
    sendDeleteSentRequest(token, friend)
    //setActiveSections([])

  }

  const handleDeleteRequest = (friend) => {
    setRequests(requests.filter((f) => f.username !== friend))
    sendDeleteRequest(token, friend)
  }

  const setSections = (sections) => {
    //setting up a active section state
    setActiveSections(sections);
  };

  const renderContent = (section) => {
    return (
      <Animatable.View animation={"fadeIn"} style={styles.content}>
        {section.content}
      </Animatable.View>
    );
  };

  const renderHeader = (section, _, isActive) => {
    //Accordion Header view
    if (section.empty) return <></>
    return (
      <View >
        <Animatable.View
          duration={400}
          style={ isActive ? styles.active : styles.inactive}
          transition="marginHorizontal">
          <Text style={styles.headerText}>{section.title}</Text>
        </Animatable.View>
        {isActive && renderContent(section, isActive)}
      </View>
    );
  };

  const Menu = () => {
    return (
      <View style={styles.downBar}>
          <TouchableOpacity style={styles.menu} onPress={() => {navigate("/", { replace: true })}} >
              <Text style={styles.text}>Menu</Text>
          </TouchableOpacity>
      </View>
    )
  }

  const Nofriends = () => {
    return(
      <View style={{flex:1, justifyContent:'center'}}>
        <View style={{padding:10, marginTop:20, borderWidth:5, borderRadius:10,  alignSelf:'center', justifyContent:'center', alignItems:'center', backgroundColor:'rgba(255,0,0,0.2)'}}>
          <Text style={styles.text}>You need to add friends</Text>
          <Text style={styles.text}>to play online!</Text>
        </View>
      </View>
    )
  }

  return (
      <View style={styles.container}>
        <HostModal />
        <View style={styles.upBar}>
            <TextInput
              style={styles.input}
              value={newFriend}
              onChangeText={(text) => setNewFriend(text)}
              placeholder="Add new friend"
              returnKeyType="done" 
              onSubmitEditing={() => handleAddFriend()}
              cursorColor={'black'}
            />
        </View>
        
        <ScrollView ove refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
          
          {loading && <LoadingSmall/>}
          {message && <Text style={styles.message}> {message} </Text>}
          {( !!friends.length || !!invites.length || !!sentRequests.length) ? null : <Nofriends/>}
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

        <Menu />
      </View>

  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'stretch',

  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 30,
  },

  headerText: {
    textAlign: 'center',
    fontSize: 24,
    padding:10,
    paddingHorizontal:20,
    paddingTop:15,

    backgroundColor:'rgba(217, 121, 80, 0.2)',
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
    marginHorizontal:30

  },
  

  upBar: {
    height:60,
    flexDirection: "row", 
    backgroundColor:"rgba(0,0,0, 0.4)", 
    paddingBottom:8,
    borderBottomWidth:4,
  },
  downBar:{
    height:70,
    flexDirection: "row", 
    backgroundColor:"rgba(0,0,0, 0.4)", 
    paddingVertical:8,

    borderTopWidth:4,
  },

  input: {
    flex: 1,
    fontFamily:"FreckleFace",
    backgroundColor: 'rgba(217, 121, 80, 0.4)',
    borderWidth: 5,
    borderColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    padding: 10,
    paddingLeft: 20,
    marginHorizontal:30
  },

  menu: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    fontFamily:"FreckleFace",
    backgroundColor: 'rgba(217, 121, 80, 0.3)',
    borderWidth: 5,
    borderColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    padding:4,
    marginHorizontal:30
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor:'black',
    borderWidth:2,

  },
  user_container: {
    flex:1,
    flexDirection: 'row',
    textAlignVertical: 'center',
    alignItems:'center',
    padding:10,

    backgroundColor: 'rgba(217, 121, 80, 0.1)',
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
    marginLeft:20,
    flex:1,
    backgroundColor: 'rgba(0, 255, 0, 0.2 )',
    borderWidth:3,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent:'center',
  },
  delete: {
    flex:1,
    backgroundColor: 'rgba(255,0,0,0.2)',
    borderWidth:3,
    padding:5,
    borderRadius: 10,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 3,

    textAlign: 'center',
    margin: 5,
    marginHorizontal:10,
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
