import React, { useEffect, useContext, useState } from 'react';
import  Constants from "expo-constants";

const baseUrl = `${Constants.manifest.extra.ws}`;

import { UserContext } from '../contexts/UserContext';

import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const Lobby = () => {
  const { user, friends, requests } = useContext(UserContext);
  const [invites, setInvites] = useState([])
  const [newFriend, setNewFriend] = useState("");
  const [ws, setWs] = useState(null);

 useEffect(() => {
    // Establish WebSocket connection when the component mounts
    const socket = new WebSocket(`${baseUrl}/ws`);
    setWs(socket);
    socket.on("open", () => {
      console.log("WebSocket connection established.");
    });


    socket.onmessage((event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data);

      if (data.type === "invite") {
        // Handle friend invite
        setInvites((prevInvites) => [...prevInvites, data.sender]);
      } else if (data.type === "join_response") {
        // Handle join response
        // Display a message indicating whether the join request was accepted or rejected
        console.log(`${data.sender} ${data.accepted ? "joined" : "could not join"} your lobby.`);
      }
    });

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      if (ws) {
        ws.close();
      }
    };
  }, [user]);

  const handleInvite = (friend) => {
    // Send WebSocket message to invite the friend
    const inviteData = {
      type: "invite",
      sender: user,
      recipient: friend,
    };
    ws.send(JSON.stringify(inviteData));
  };

  const handleJoin = (friend) => {
    // Send WebSocket message to join the friend's lobby
    const joinData = {
      type: "join",
      sender: user,
      recipient: friend,
    };
    ws.send(JSON.stringify(joinData));
  };


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
              <TouchableOpacity  style={styles.joinItem} onPress={() => handleJoin(friend)}>
                <Text>Join</Text>
              </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Horizontal scroll view of friend requests */}
      <ScrollView
        horizontal
        style={styles.requestsScrollView}
        contentContainerStyle={styles.requestsScrollViewContent}
      >
        {invites && invites.map((invite) => (
          <TouchableOpacity
            key={invite}
            style={styles.requestItem}
            onPress={() => handleInvite(invite)}
          >
            <Text>{invite}</Text>
          </TouchableOpacity>
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
