import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

// StartScreen component that handles user input and navigation to the chat screen
const StartScreen = ({ navigation }) => {
  // State to hold the user's name
  const [name, setName] = useState("");
  // Predefined background colors
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];
  // State to manage selected background color
  const [bgColor, setBgColor] = useState(colors[0]);
  // Path to the background image, adjust as necessary
  const image = require("../img/BackgroundImage.png");

  // Function to handle the anonymous sign-in process and navigate to Chat
  const handlePress = () => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then((result) => {
        // Navigate to the Chat screen with parameters upon successful sign-in
        navigation.navigate("Chat", { userId: result.user.uid, name, bgColor });
      })
      .catch((error) => console.error("Anonymous sign-in failed", error));
  };

  // JSX to render the Start Screen UI
  return (
    <ImageBackground source={image} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Welcome!</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Type your username here"
            placeholderTextColor="#757083"
          />
          <Text style={styles.label}>Choose Background Color</Text>
          <FlatList
            data={colors}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setBgColor(item)}
                style={[styles.colorOption, { backgroundColor: item }]}
              />
            )}
            keyExtractor={(item) => item}
            horizontal={true}
            style={styles.colorList}
          />
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

// StyleSheet to style various elements of the StartScreen
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOffset: { height: 2, width: 2 },
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
  },
  textInput: {
    fontSize: 18,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#757083",
    marginBottom: 20,
    padding: 10,
  },
  label: {
    fontSize: 16,
    color: "#757083",
    marginBottom: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  colorList: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#757083",
    width: "100%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default StartScreen;
