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

const StartScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];
  const [bgColor, setBgColor] = useState(colors[0]);
  const image = require("../img/BackgroundImage.png");

  return (
    <ImageBackground
      source={image}
      resizeMode="cover"
      style={styles.background}
    >
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
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("Chat", { name: name, bgColor: bgColor })
            }
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

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
