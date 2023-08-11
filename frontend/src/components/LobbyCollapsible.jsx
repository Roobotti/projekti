

import React, { useEffect, useContext, useState } from 'react';

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


import MultiPlayer from './MultiPlayer';
import { loadFriend, loadFriendData, sendDeleteFriend, sendDeleteRequest, sendDeleteSentRequest, sendRequest } from '../services/users';

import { socket } from '../services/socket';
import FriendProfile from './Friend';
import { Loading } from './Loading';



export const LobbyCollap = () => {
  const { user, friends, requests, token, sentRequests, wins, invites, setSentInvite, setReFresh, setFriends, setRequests, setInvites, setSentRequests } = useContext(UserContext);
  const [newFriend, setNewFriend] = useState("");
  const [game, setGame] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
    // Ddefault active selector
  const [activeSections, setActiveSections] = useState([]);
  // Collapsed condition for the single collapsible
  const [collapsed, setCollapsed] = useState(true);

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect( () => {
    socket.emit('active', {user})
    socket.on("connect", () => {
    console.log("connected");
    socket.emit("connection")
  });
    socket.on("disconnect", () => {
    console.log("disconnected"); // undefined
  });

  socket.on(`${user}/post`, async (data) => {
    console.log("sender", data.user, "user", user)
    const friend =  await loadFriendData(data.user)
    switch (data.type) {
      case "invite":
        if (!invites.map((f) => f.username).includes(data.user)) {
          await setInvites([...invites, await friend]);
        }
          break;
      case "cancel_invite":
          await setInvites(invites.filter((i) => i.username !== data.user));
          console.log("invite_removed");
          break;
      case "accept":
        if (!friends.map((f) => f.username).includes(data.user)) {
          await setFriends([...friends, await friend])
        }
        await setRequests(requests.filter((f) => f.username !== data.user))
        console.log("accept");
        break;
      case "request":
        if (!requests.map((r) => r.username).includes(await friend.username)) {
          await setRequests([...requests, await friend])
        }
        console.log("request");
        break;

    }

  });

  }, [user])
  
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

  const CONTENT = [
      {
      empty: invites.length,
      title: `Invites (${invites.length})`,
      content:
        <View  style={styles.map_container}>
            {invites && invites.map((i) => (
              <View key={i.username} style={styles.user_container}>
                <Image source={{ uri: `data:image/*;base64,${i.avatar}` }} style={styles.avatar}/>
                <Text>{i.username}</Text>
                <TouchableOpacity style={{...styles.add, backgroundColor:'green'}} onPress={() => handleJoin(i.username)} >
                  <Text>Join</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
    },
    {
      empty: friends.length,
      title: `Friends (${friends.length})`,
      content:
          <View  style={styles.map_container}>
          {friends && friends.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
                <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }} style={styles.avatar}/>
                <TouchableOpacity style={{...styles.add, backgroundColor:'pink'}} onPress={() => handleProfile(friend.username)} >
                  <Text>{friend.username}</Text>
                </TouchableOpacity>
                {(invites && invites.map((i) => i.username).includes(friend.username))
                  ? (
                    <TouchableOpacity style={{...styles.add, backgroundColor:'green'}} onPress={() => handleJoin(friend.username)} >
                      <Text>Join</Text>
                    </TouchableOpacity>
                  ) 
                  :(
                    <TouchableOpacity style={{...styles.add, backgroundColor:'green'}} onPress={() => handleInvite(friend.username)} >
                      <Text>Host</Text>
                    </TouchableOpacity>
                  )
                }
            </View>
          ))}
        </View>
    },
    {
      empty: requests.length,
      title: `Friend requests (${requests.length})`,
      content:(
        <View  style={styles.map_container}>
          {requests && requests.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
                <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }} style={styles.avatar}/>
                <Text style={{alignSelf:'center'}}>{friend.username}</Text>
                <TouchableOpacity style={{...styles.add, backgroundColor:'green'}} onPress={() => handleAccept(friend.username)} >
                  <Text>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.add} onPress={() => handleDeleteRequest(friend.username)} >
                  <Text>Delete</Text>
                </TouchableOpacity>
            </View>
          ))}
        </View>
      )
    },
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
  ];

  const handleInvite = async (friend) => {
    console.log("invite", user, friend)
    socket.emit("invite", {"user":user, "friend":friend});
    setSentInvite(friend)
    setGame(<MultiPlayer user={user} friend={friend} />)
  };

  const handleJoin = (friend) => {
    console.log("join")
    setGame(<MultiPlayer user={user} friend={friend} />)

  };

  const handleProfile = (friend) => {
    console.log("to friend profile", friend)
    setGame(<FriendProfile friend={friend} onDelete={() => { 
      handleDeleteFriend(friend) 
      setGame(null)
    }} onBack={(v) => setGame(v)}/>)
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
  }

  const handleDeleteRequest = (friend) => {
    console.log("Deleted")
    setRequests(requests.filter((f) => f.username !== friend))
    sendDeleteRequest(token, friend)
  }


  if (game) return game

  const setSections = (sections) => {
    //setting up a active section state
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = (section, _, isActive) => {
    //Accordion Header view
    if (!section.empty) return <></>
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor">
        <Text style={styles.headerText}>{section.title}</Text>
      </Animatable.View>
    );
  };

  const renderContent = (section, _, isActive) => {
    //Accordion Content view
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition='backgroundColor'>
        <Animatable.Text
          animation={isActive ? 'bounceIn' : undefined}
          style={{ flex: 1, alignSelf:'stretch', justifyContent: 'space-between', textAlign: 'center', display:'flex', }}>
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView 
      style={{ flex: 1 }}
      >
      <View style={styles.container}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
          <TextInput
            style={styles.input}
            value={newFriend}
            onChangeText={(text) => setNewFriend(text)}
            placeholder="Add new friend"
            returnKeyType="done" 
            onSubmitEditing={() => handleAddFriend()}
          />
          {loading && <Loading/>}
          {message && <Text style={styles.message}> {message} </Text>}

          {/*Code for Accordion/Expandable List starts here*/}
          <Accordion
            activeSections={activeSections}
            //for any default active section
            sections={CONTENT}
            //title and content of accordion
            touchableComponent={TouchableOpacity}
            //which type of touchable component you want
            //It can be the following Touchables
            //TouchableHighlight, TouchableNativeFeedback
            //TouchableOpacity , TouchableWithoutFeedback
            expandMultiple={false}
            //Do you want to expand mutiple at a time or single at a time
            renderHeader={renderHeader}
            //Header Component(View) to render
            renderContent={renderContent}
            //Content Component(View) to render
            duration={400}
            //Duration for Collapse and expand
            onChange={setSections}
            //setting the state of active sections
          />
          {/*Code for Accordion/Expandable List ends here*/}
        </ScrollView>
      </View>
    </SafeAreaView>
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
    marginBottom: 20,
  },
  header: {
    flex:1,
    backgroundColor: 'transparent',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    margin: 10,
    padding: 10,
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    
  },
  active: {
    backgroundColor: 'transparent',
  },
  inactive: {
    backgroundColor: 'transparent',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  user_container: {
    flex: 1,
    width: 300,  /* Or whatever */
    margin: 'auto', /* Magic! */
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    textAlignVertical: 'center',
    
  },
  map_container: {
    flex:1, 
    rowGap:20, 
    display:'flex'
  },
  delete: {
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 20,
    marginLeft: 40,
  },
  add: {
    alignSelf: 'center',
    backgroundColor: 'red',
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
  }
});
