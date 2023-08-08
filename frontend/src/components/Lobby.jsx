import React, { useEffect, useContext, useState, Component } from 'react';
import { history } from 'react-router-native';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion'

import { UserContext } from '../contexts/UserContext';
import Text from './Text';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import MultiPlayer from './MultiPlayer';
import { sendDeleteFriend, sendDeleteRequest, sendDeleteSentRequest, sendRequest } from '../services/users';

import { socket } from '../services/socket';
import FriendProfile from './Friend';


const Lobby = () => {
  const { user, friends, requests, token, sentRequests, wins, invites, setSentInvite, setReFresh, setFriends, setRequests, setInvites, setSentRequests } = useContext(UserContext);
  const [newFriend, setNewFriend] = useState("");
  const [game, setGame] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
  const [requestsCollaps, setRequestsCollaps] = useState(null)
  const [sentRequestsCollaps, setSentRequestsCollaps] = useState(Object.fromEntries(sentRequests.map(r => [r, false])))
  const activeSections = useState([0])
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

  socket.on(`${user}/post`, (data) => {
    console.log("sender", data.user)
    switch (data.type) {
      case "invite":
        setInvites(...invites, data.user);
        console.log("invited");
        break;
      case "cancel_invite":
          setInvites(invites.filter((i) => i !== data.user));
          console.log("invite_removed");
          break;
      case "accept":
        setFriends([...friends, data.user])
        setRequests(requests.filter((f) => f !== data.user))
        console.log("accept");
        break;
      case "request":
        setRequests([...friends, data.user])
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
    setGame(<FriendProfile friend={friend} onDelete={handleDeleteFriend} />)
  }

  const handleAccept = (friend) => {
    console.log("Accept")
    setRequestsCollaps(null)
    setFriends([...friends, friend])
    setRequests(requests.filter((f) => f !== friend))
    socket.emit('accept', {"user":user, "friend":friend});
    sendRequest(token, friend)
  };

  const handleAddFriend = () => {
    console.log("tok:", token)
    if (newFriend in friends || newFriend in sentRequests || newFriend === user) return null
    if (newFriend in requests) return handleAccept(newFriend)
    if (!sentRequests.includes(newFriend) && sendRequest(token, newFriend)) {
      socket.emit('request', {"user":user, "friend":newFriend})
      setSentRequests([...sentRequests, newFriend])
    }
  };

  const handleDeleteFriend = (friend) => {
    console.log("Deleted")
    setRequestsCollaps(null)
    setFriends(friends.filter((f) => f !== friend))
    sendDeleteFriend(token, friend)
  }

  const handleDeleteSentRequest = (friend) => {
    console.log("Deleted")
    setSentRequests(sentRequests.filter((f) => f !== friend))
    setRequestsCollaps(null)
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

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
      {/* Input box for adding new friends */}
      <TextInput
        style={styles.input}
        value={newFriend}
        onChangeText={(text) => setNewFriend(text)}
        placeholder="Add new friend"
        returnKeyType="done" 
        onSubmitEditing={() => handleAddFriend()}
      />

    {/* Horizontal scroll view of the user's friends */}
    <Text style={styles.label}>Friends</Text>
    <ScrollView
      horizontal
      style={styles.friendsScrollView}
      contentContainerStyle={styles.friendsScrollViewContent}
    >
      {friends && friends.map((friend) => (
        <View key={friend} style={styles.friendItemContainer}>
            <TouchableOpacity style={styles.friendItem} onPress={() => handleProfile(friend)}>
              <Text>{friend}</Text>
            </TouchableOpacity>
            {
              invites && invites.includes(friend) ? (
              <TouchableOpacity  style={styles.joinItem} onPress={() => handleJoin(friend)}>
                <Text>join</Text>
              </TouchableOpacity>) :(
              <TouchableOpacity  style={styles.joinItem} onPress={() => handleInvite(friend)}>
                <Text>Host</Text>
              </TouchableOpacity>)
            }
        </View>
      ))}
    </ScrollView>
    
    {/* Horizontal scroll view of the user's requests */}
    <Text style={styles.label}>Friend requests</Text>
    <ScrollView
      horizontal
      style={styles.friendsScrollView}
      contentContainerStyle={styles.requestsScrollViewContent}
    >
      {requests && requests.map((friend) => (
        
        <View key={friend} style={styles.friendItemContainer}>
            <TouchableOpacity style={styles.friendItem} onPress={() => handleRequestCollab(friend)}>
              <Text>{friend}</Text>
            </TouchableOpacity>
        </View>
      ))}
    </ScrollView>

    {/* Horizontal scroll view of the user's sent requests */}
    <Text style={styles.label}>Sent requests</Text>
    <ScrollView
      horizontal
      contentContainerStyle={styles.requestsScrollViewContent}
    >
      {sentRequests && sentRequests.map((friend) => (
        <View key={friend} style={styles.friendItemContainer}>
            <TouchableOpacity style={styles.friendItem} onPress={() => handleRequestCollab(friend)}>
              <Text>{friend}</Text>
            </TouchableOpacity>
        </View>
      ))}
    </ScrollView>

    {/*Collapsible for handling requests*/}
    <Collapsible style={styles.friendItem} collapsed={!requestsCollaps}>

      {requests.includes(requestsCollaps) 
      ? (
        <View>
          <Text>Friend request of {requestsCollaps}</Text>
          <View style={styles.addDelete}>
            <TouchableOpacity style={styles.addItem} onPress={() => handleAccept(requestsCollaps)}>
              <Text>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteItem} onPress={() => handleDeleteRequest(requestsCollaps)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
      : (
        <View>
          <Text>Friend Request for {requestsCollaps}</Text>
          <View style={styles.addDelete}>
            <TouchableOpacity style={styles.addItem} onPress={() => setRequestsCollaps(null)}>
              <Text>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteItem} onPress={() => handleDeleteSentRequest(requestsCollaps)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
      }
    </Collapsible>
    

  </ScrollView>
  );
  }


const styles = StyleSheet.create({

  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'stretch',
    padding: 20,
  },
  addDelete: {
    flexDirection: 'row',
    padding: 20,
    marginBottom: 20,
    justifyContent: 'space-around'
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  friendsScrollView: {
    height: 50,
    marginBottom: 5,
  },
  friendsScrollViewContent: {
    alignItems: "center",
  },
  requestsScrollViewContent: {
    alignItems: "center",
  },
  friendItemContainer: {
    flexDirection: "row", // Set the flexDirection to row
    alignItems: "center", // Align children vertically in the center
    marginRight: 10, // Add some margin between friend items
  },
  addItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "green",
    borderRadius: 10,
  },
  deleteItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "red",
    borderRadius: 10,
  },
  friendItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffccfc",
    borderRadius: 5,
    marginLeft: 10,
  },
  joinItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ceff96",
    borderRadius: 5,
    marginLeft: 0,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'flex-end',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: "#ffccfc",
    borderRadius: 10,
    marginVertical: 10,
  },
  requestsScrollView: {
    height: 50,
    marginBottom: 5,
  },
  requestsScrollViewContent: {
    alignItems: "center",
  },
  requestItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Lobby;
