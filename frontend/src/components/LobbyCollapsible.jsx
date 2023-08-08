

import React, { useEffect, useContext, useState, Component } from 'react';

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

//import for the collapsible/Expandable view
import Collapsible from 'react-native-collapsible';

//import for the Accordion view
import Accordion from 'react-native-collapsible/Accordion';

import { UserContext } from '../contexts/UserContext';
import Text from './Text';


import MultiPlayer from './MultiPlayer';
import { loadFriend, sendDeleteFriend, sendDeleteRequest, sendDeleteSentRequest, sendRequest } from '../services/users';

import { socket } from '../services/socket';
import FriendProfile from './Friend';



//To make the selector (Something like tabs)
const SELECTORS = [
  { title: 'T&C', value: 0 },
  { title: 'Privacy Policy', value: 1 },
  { title: 'Return Policy', value: 2 },
  { title: 'Reset all' },
];

export const LobbyCollap = () => {
  const { user, friends, requests, token, sentRequests, wins, invites, setSentInvite, setReFresh, setFriends, setRequests, setInvites, setSentRequests } = useContext(UserContext);
  const [newFriend, setNewFriend] = useState("");
  const [game, setGame] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
  const [requestsCollaps, setRequestsCollaps] = useState(null)
  const [sentRequestsCollaps, setSentRequestsCollaps] = useState(Object.fromEntries(sentRequests.map(r => [r, false])))
    // Ddefault active selector
  const [activeSections, setActiveSections] = useState([]);
  // Collapsed condition for the single collapsible
  const [collapsed, setCollapsed] = useState(true);
  console.log(invites)
  console.log(requestsCollaps)

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
    console.log("sender", data.user)
    const friend =  await loadFriend(data.user)
    switch (data.type) {
      case "invite":
        setInvites(...invites, await friend);
        console.log("invited");
        break;
      case "cancel_invite":
          setInvites(invites.filter((i) => i.username !== data.user));
          console.log("invite_removed");
          break;
      case "accept":
        setFriends([...friends, friend])
        setRequests(requests.filter((f) => f.username !== data.user))
        console.log("accept");
        break;
      case "request":
        setRequests([...friends, await friend])
        console.log("request");
        break;

    }

  });

  }, [user])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setReFresh(Math.random())
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const CONTENT = [
    {
      title: `Friends (${friends.length})`,
      content:
          <View>
          {friends && friends.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
                <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }} style={styles.avatar}/>
                <TouchableOpacity style={{...styles.add, backgroundColor:'pink'}} onPress={() => handleProfile(friend.username)} >
                  <Text>{friend.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.add, backgroundColor:'green'}} onPress={() => handleInvite(friend.username)} >
                  <Text>Host</Text>
                </TouchableOpacity>
            </View>
          ))}
        </View>
    },
    {
      title: `Friend requests (${requests.length})`,
      content:(
        <View>
          {requests && requests.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
                <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }} style={styles.avatar}/>
                <Text>{friend.username}</Text>
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
      title: `Sent requests (${sentRequests.length})`,
      content:
        (
        <View style={styles.c}>
          {sentRequests && sentRequests.map((friend) => (
            <View key={friend.username} style={styles.user_container}>
              <Image source={{ uri: `data:image/*;base64,${friend.avatar}` }} style={styles.avatar}/>
              <Text>{friend.username}</Text>
              <TouchableOpacity style={styles.delete} onPress={() => handleDeleteSentRequest(friend.username)} >
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )
    },
  ];

  const handleInvite = (friend) => {
    console.log("invite", friend)
    socket.emit('invite', {"user":user, "friend":friend});
    setSentInvite(friend)
    setGame(<MultiPlayer user={user} friend={friend} />)
  };

  const handleJoin = (friend) => {
    console.log("join")
    setGame(<MultiPlayer user={user} friend={friend} />)

  };

  const handleProfile = (friend) => {
    console.log("to friend profile", friend)
    setGame(<FriendProfile friend={friend} onDelete={handleDeleteFriend} onBack={(v) => setGame(v)}/>)
  }

  const handleAccept = async (friend) => {
    const friendData = await loadFriend(friend)
    console.log("Accept")
    setFriends([...friends, await friendData])
    setRequests(requests.filter((f) => f.username !== friend))
    socket.emit('accept', {"user":user, "friend":friend});
    sendRequest(token, friend)
  };

  const handleAddFriend = async () => {
    console.log("tok:", token)
    if (newFriend in friends || newFriend in sentRequests || newFriend === user) return null
    if (newFriend in requests) return handleAccept(newFriend)
    if (!sentRequests.includes(newFriend)) {
      const friend = await sendRequest(token, newFriend)
      socket.emit('request', {"user":user, "friend": newFriend})
      if (friend) setSentRequests([...sentRequests, await friend])
    }
  };

  const handleDeleteFriend = (friend) => {
    console.log("Deleted")
    setRequestsCollaps(null)
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
    setRequests(requests.filter((f) => f !== friend))
    setRequestsCollaps(null)
    sendDeleteRequest(token, friend)
  }

  const handleRequestCollab = (friend) => {
    setRequestsCollaps(requestsCollaps === friend ? null : friend)
  }

  if (game) return game

  const toggleExpanded = () => {
    //Toggling the state of single Collapsible
    setCollapsed(!collapsed);
  };

  const setSections = (sections) => {
    //setting up a active section state
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = (section, _, isActive) => {
    //Accordion Header view
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
        transition="backgroundColor">
        <Animatable.Text
          animation={isActive ? 'bounceIn' : undefined}
          style={{ textAlign: 'center' }}>
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

          {/*Code for Single Collapsible Start*/}
          <TouchableOpacity onPress={toggleExpanded}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Invites ({invites.length})</Text>
            </View>
          </TouchableOpacity>
          {/*Content of Single Collapsible*/}
          <Collapsible collapsed={collapsed} align="center">
            <View style={styles.content}>
              <Text style={{ textAlign: 'center' }}>
                
              </Text>
            </View>
          </Collapsible>
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
    backgroundColor: '#F5FCFF',
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
    backgroundColor: '#F5FCFF',
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
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
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
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
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
    flexDirection: 'row',
    columnGap: 20,
    alignContent: 'center',
    alignItems: 'center'
  },
  delete: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 20,
    marginLeft: 40,
  },
  add: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 20,
  }
});
