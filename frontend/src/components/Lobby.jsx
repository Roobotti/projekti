import React, { useEffect, useContext, useState } from 'react';
import { history } from 'react-router-native';


import { UserContext } from '../contexts/UserContext';

import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MultiPlayer from './MultiPlayer';
import { sendRequest } from '../services/users';

import { socket } from '../services/socket';


const Lobby = () => {
  const { user, friends, requests, token, sentRequests, wins, invites, setSentInvite, setReFresh, setFriends, setRequests, setInvites } = useContext(UserContext);
  const [newFriend, setNewFriend] = useState("");
  const [game, setGame] = useState(null)
  console.log(invites)

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

  const handleAccept = (friend) => {
    console.log("Accept")
    setFriends([...friends, friend])
    setRequests(requests.filter((f) => f !== friend))
    socket.emit('accept', {"user":user, "friend":friend});
    sendRequest(token, friend)
  };

  const handleAddFriend = () => {
    console.log("tok:", token)
    if (newFriend in friends || newFriend in sentRequests || newFriend === user) return null
    if (newFriend in requests) return handleAccept(newFriend)
    if (sendRequest(token, newFriend)) socket.emit('request', {"user":user, "friend":newFriend});
  };

  if (game) return game

  return (
    <View style={styles.container}>
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
              <TouchableOpacity style={styles.friendItem}>
                <Text>{friend}</Text>
              </TouchableOpacity>
              {
                invites && invites.includes(friend) ? (
                <TouchableOpacity  style={styles.joinItem} onPress={() => handleJoin(friend)}>
                  <Text>join</Text>
                </TouchableOpacity>) :(
                <TouchableOpacity  style={styles.joinItem} onPress={() => handleInvite(friend)}>
                  <Text>invite</Text>
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
        contentContainerStyle={styles.friendsScrollViewContent}
      >
        {requests && requests.map((friend) => (
          <View key={friend} style={styles.friendItemContainer}>
              <TouchableOpacity style={styles.friendItem}  onPress={() => handleAccept(friend)}>
                <Text>{friend}</Text>
              </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Horizontal scroll view of the user's sent requests */}
      <Text style={styles.label}>Sent requests</Text>
      <ScrollView
        horizontal
        style={styles.friendsScrollView}
        contentContainerStyle={styles.friendsScrollViewContent}
      >
        {sentRequests && sentRequests.map((friend) => (
          <View key={friend} style={styles.friendItemContainer}>
              <TouchableOpacity style={styles.friendItem}>
                <Text>{friend}</Text>
              </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.friendItemContainer}>
        <TouchableOpacity style={styles.friendItem} onPress={() => setReFresh(Math.random()) }>
          <Text>reFresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
        }


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  friendsScrollView: {
    height: 50,
    marginBottom: 10,
  },
  friendsScrollViewContent: {
    alignItems: "center",
  },
  friendItemContainer: {
    flexDirection: "row", // Set the flexDirection to row
    alignItems: "center", // Align children vertically in the center
    marginRight: 10, // Add some margin between friend items
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
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: "#ffccfc",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  requestsScrollView: {
    height: 50,
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
