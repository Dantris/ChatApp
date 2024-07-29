// Importing necessary React, React Navigation, NetInfo, and Firebase components
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import screens used in the application
import StartScreen from "./components/Start";
import ChatScreen from "./components/Chat";

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
const app = initializeApp(firebaseConfig);
// Get a Firestore instance linked to the Firebase project
export const db = getFirestore(app);
// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Create a stack navigator for handling the navigation between screens
const Stack = createNativeStackNavigator();

// App component that sets up navigation and screen components
const App = () => {
  const netInfo = useNetInfo(); // Hook to monitor network status

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
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

export default App;
