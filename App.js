// Importing necessary React and React Navigation components
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

// Import screens used in the application
import StartScreen from "./components/Start";
import ChatScreen from "./components/Chat";

// Firebase initialization imports
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object containing keys and identifiers for Firebase services
const firebaseConfig = {
  apiKey: "AIzaSyASUNBOzMS_k-JD5hzvx2tSl6Al749fe8I",
  authDomain: "chatappcf-704ca.firebaseapp.com",
  projectId: "chatappcf-704ca",
  storageBucket: "chatappcf-704ca.appspot.com",
  messagingSenderId: "50675208426",
  appId: "1:50675208426:web:75d5ebf31e83adb46a8793",
};

// Initialize Firebase with the above configuration
initializeApp(firebaseConfig);
// Get a Firestore instance linked to the Firebase project
export const db = getFirestore();

// Create a stack navigator for handling the navigation between screens
const Stack = createNativeStackNavigator();

// App component that sets up navigation and screen components
const App = () => {
  return (
    <NavigationContainer>
      {/* Navigation container manages the navigation tree and contains the navigation state */}
      <Stack.Navigator initialRouteName="Start">
        {/* Stack.Navigator organizes screens for navigation and handles transitions */}
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          initialParams={{ isConnected: netInfo.isConnected }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles for the app, currently unused but can be applied to components
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

// Export the App component as the default export of the module
export default App;
