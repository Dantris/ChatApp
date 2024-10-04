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
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from "@env";

// Import screens used in the application
import Welcome from "./components/Start";
import Chat from "./components/Chat";

// Suppress specific logs related to AsyncStorage being extracted from React Native core
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Firebase configuration object containing keys and identifiers for Firebase services
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
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
