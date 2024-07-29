import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  AsyncStorage,
} from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { db } from "../App"; // Ensure db is correctly initialized in the App component
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";

const ChatScreen = ({ route }) => {
  const { userId, name, bgColor } = route.params; // Extracting parameters passed via navigation
  const [messages, setMessages] = useState([]); // State to store chat messages
  const netInfo = useNetInfo(); // Hook to monitor network status

  useEffect(() => {
    // Reacts to changes in network connection
    if (netInfo.isConnected) {
      // Query to fetch messages when online, ordered by creation time
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: new Date(doc.data().createdAt.seconds * 1000), // Convert server timestamp to JS Date object
          ...doc.data(),
        }));
        setMessages(fetchedMessages); // Update state with new messages
        AsyncStorage.setItem("messages", JSON.stringify(fetchedMessages)); // Cache messages in local storage
      });
      return () => unsubscribe(); // Cleanup subscription
    } else {
      // Fetch messages from local storage when offline
      AsyncStorage.getItem("messages").then((storedMessages) => {
        if (storedMessages) setMessages(JSON.parse(storedMessages));
      });
    }
  }, [netInfo.isConnected]);

  const onSend = async (newMessages = []) => {
    if (netInfo.isConnected) {
      // Only allow sending messages when online
      const message = newMessages[0];
      await addDoc(collection(db, "messages"), {
        ...message,
        createdAt: new Date(), // Use current date for new messages
      });
    }
  };

  const renderInputToolbar = (props) => {
    // Conditionally render the input toolbar based on network status
    if (!netInfo.isConnected) return null; // Return null to hide toolbar when offline
    return <InputToolbar {...props} />; // Otherwise, render the default toolbar
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userId,
          name: name,
        }}
        renderInputToolbar={renderInputToolbar}
      />
      {/* Adjust screen when keyboard displays, especially for iOS */}
      {Platform.OS === "ios" && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full screen, flexible container
  },
});

export default ChatScreen;
