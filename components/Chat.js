import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { db } from "../App"; // Import the Firestore database instance from App.js
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const ChatScreen = ({ route }) => {
  // Retrieve params passed from navigation
  const { userId, name, bgColor } = route.params;
  // State to store messages
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Define the query to order messages by createdAt timestamp in descending order
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    // Listen for real-time updates with onSnapshot
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Map through documents and reformat the date and merge document data
      const messages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        createdAt: new Date(doc.data().createdAt.seconds * 1000), // Convert Firestore timestamp to JS Date
        ...doc.data(),
      }));
      setMessages(messages); // Update state with new messages
    });
    // Cleanup function to unsubscribe from the listener on component unmount
    return () => unsubscribe();
  }, []);

  const onSend = (newMessages = []) => {
    const message = newMessages[0]; // Get the first message from the array
    // Add a new document to Firestore with the message data and current timestamp
    addDoc(collection(db, "messages"), { ...message, createdAt: new Date() });
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <GiftedChat
        messages={messages} // Display messages from state
        onSend={(messages) => onSend(messages)} // Handler for sending messages
        user={{
          _id: userId, // Current user's ID
          name: name, // Current user's name
        }}
      />
      {/* KeyboardAvoidingView to adjust screen when keyboard displays */}
      {Platform.OS === "ios" && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Use flex to fill the available screen
  },
});

export default ChatScreen;
