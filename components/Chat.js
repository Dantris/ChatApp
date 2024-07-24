import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const ChatScreen = ({ route, navigation }) => {
  const { name, bgColor } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = (newMessages = []) => {
    setMessages(GiftedChat.append(messages, newMessages));
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
