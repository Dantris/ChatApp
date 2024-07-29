import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { db } from "../App"; // Make sure this path is correct
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";

const ChatScreen = ({ route }) => {
  const { userId, name, bgColor } = route.params;
  const netInfo = useNetInfo(); // Use the hook directly in the component
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let unsubscribe = () => {};

    if (netInfo.isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt.toDate(),
          user: doc.data().user,
        }));
        setMessages(fetchedMessages);
        AsyncStorage.setItem("messages", JSON.stringify(fetchedMessages));
      });
    } else {
      AsyncStorage.getItem("messages").then((storedMessages) => {
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      });
    }

    return () => unsubscribe();
  }, [netInfo.isConnected]);

  const onSend = async (newMessages = []) => {
    if (netInfo.isConnected && newMessages.length > 0) {
      const message = newMessages[0];
      await addDoc(collection(db, "messages"), {
        ...message,
        createdAt: new Date(),
      });
    }
  };

  const renderInputToolbar = (props) => {
    if (!netInfo.isConnected) return null;
    return <InputToolbar {...props} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: userId,
          name: name,
        }}
        renderInputToolbar={renderInputToolbar}
      />
      {Platform.OS === "ios" && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
