import React, { useEffect, useContext, useState } from 'react';
import { history } from 'react-router-native';
import  Constants from "expo-constants";
import { io } from "socket.io-client";

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

const baseUrl = `${Constants.manifest.extra.ws}`;
const socket = io.connect(baseUrl, {
			path: '/ws/socket.io',
		})

console.log(baseUrl)
// client-side

const Lobby = () => {
  const { user, friends, requests } = useContext(UserContext);
  const [invites, setInvites] = useState([])
  const [newFriend, setNewFriend] = useState("");
  const [game, setGame] = useState(null)
  console.log(invites)

  useEffect( () => {
    socket.on("connect", () => {
    console.log("connected");
    socket.emit("connection")
  });

    socket.on("disconnect", () => {
    console.log("disconnected"); // undefined
  });

  socket.on(user, (data) => {
  console.log("sender",data.user)
  if (data.type === "invite") { 
    setInvites(...invites, data.user)
    console.log("invited")
  }
  });

  }, [user])

  const handleInvite = (friend) => {
    console.log("invite", friend)
    socket.emit('invite', {"user":user, "friend":friend});
    setGame(<MultiPlayer host={true} user={user} friend={friend}/>)
  };

  const handleJoin = (friend) => {
    console.log("join")
    setGame(<MultiPlayer host={false} user={user} friend={friend}/>)
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
        onSubmitEditing={() => handleAddFriend()}
      />

      {/* Horizontal scroll view of the user's friends */}
      <ScrollView
        horizontal
        style={styles.friendsScrollView}
        contentContainerStyle={styles.friendsScrollViewContent}
      >
        <Text style={styles.label}>Friends</Text>
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
    </View>
  );
        }

  // Function to handle adding a new friend
  const handleAddFriend = () => {
    console.log(newFriend)
  };


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
