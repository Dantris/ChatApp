import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { LogBox, Alert } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import screens used in the application
import Welcome from "./components/Start";
import Chat from "./components/Chat";

// Suppress specific logs related to AsyncStorage being extracted from React Native core
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

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

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Create the navigator for handling screen transitions
const Stack = createNativeStackNavigator();

/**
 * The main App component that manages the navigation and network status.
 * It initializes Firebase services and manages offline/online state for Firestore.
 */
const App = () => {
  const connectionStatus = useNetInfo(); // Hook to monitor network status

  useEffect(() => {
    // Effect to handle network status changes
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db); // Disable Firestore network access when offline
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db); // Enable Firestore network access when online
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Define the Welcome screen as the initial route */}
        <Stack.Screen name="Welcome" component={Welcome} />
        {/* Define the Chat screen, passing necessary props including connection status and Firebase services */}
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
