import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

/**
 * Chat component is the main chat screen where users can send and receive messages,
 * share images, and location, all while utilizing Firebase Firestore for message storage.
 */
const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, background, userID } = route.params; // Extracting navigation parameters
  const [messages, setMessages] = useState([]); // State to store messages

  /**
   * Function to handle sending messages.
   * Adds the new message to the Firestore database.
   * @param {Array} newMessages - Array containing the new message to be sent.
   */
  const onSend = async (newMessages) => {
    await addDoc(collection(db, "messages"), newMessages[0]);
  };

  /**
   * Function to customize the appearance of the message bubble.
   */
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000", // Black background for sent messages
        },
        left: {
          backgroundColor: "#FFF", // White background for received messages
        },
      }}
    />
  );

  /**
   * Function to conditionally render the input toolbar based on the network connection.
   */
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    return null; // Hide input toolbar if not connected
  };

  /**
   * Function to render the custom actions for the chat (e.g., sending images, location).
   */
  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage} {...props} />;
  };

  /**
   * Function to render custom views within the chat, such as a map view for locations.
   */
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  /**
   * Function to load cached messages from AsyncStorage when offline.
   */
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("messages");
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error("Failed to load messages from cache", error);
    }
  };

  /**
   * Function to cache messages in AsyncStorage.
   * This allows for offline access to the chat history.
   * @param {Array} messagesToCache - Array of messages to be cached.
   */
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.error("Failed to cache messages", error);
    }
  };

  /**
   * useEffect hook to handle message loading and listening for updates.
   */
  useEffect(() => {
    navigation.setOptions({ title: name }); // Set the chat screen title to the user's name

    let unsubMessages;

    const fetchMessages = async () => {
      await loadCachedMessages(); // Load messages from cache first

      if (isConnected) {
        // If connected, subscribe to message updates from Firestore
        const q = query(
          collection(db, "messages"),
          orderBy("createdAt", "desc")
        );
        unsubMessages = onSnapshot(q, (docs) => {
          let newMessages = [];
          docs.forEach((doc) => {
            newMessages.push({
              _id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis()),
            });
          });
          cacheMessages(newMessages); // Cache new messages
          setMessages(newMessages); // Update state with new messages
        });
      }
    };

    fetchMessages();

    return () => {
      if (unsubMessages) unsubMessages(); // Clean up the listener on unmount
    };
  }, [isConnected]);

  /**
   * Function to render the avatar in the chat based on the user's name initial.
   */
  const renderAvatar = (props) => {
    const nameInitial = props.currentMessage.user.name.charAt(0).toUpperCase();
    return (
      <View style={[styles.avatar, { backgroundColor: "#D3D3D3" }]}>
        <Text style={styles.avatarText}>{nameInitial}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.chatContainer, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderAvatar={renderAvatar}
        onSend={(messages) => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: userID,
          name: name,
        }}
      />
      {Platform.OS === "android" || Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

/**
 * Styles for the chat screen components.
 */
const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    width: "100%",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});

export default Chat;
