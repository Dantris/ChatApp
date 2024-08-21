# Chat App

This is a chat application built using React Native and Firebase. The app allows users to sign in anonymously, send messages, share their location, and upload photos. This README will guide you through the steps to set up the development environment, configure the Firebase database, and install the necessary libraries.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setting Up the Development Environment](#setting-up-the-development-environment)
- [Firebase Configuration](#firebase-configuration)
- [Installing Dependencies](#installing-dependencies)
- [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Anonymous user authentication
- Real-time messaging
- Image sharing from camera and library
- Location sharing
- Offline data persistence

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) installed on your machine (LTS version recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) as the package manager
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) installed globally (`npm install -g expo-cli`)
- [Firebase account](https://firebase.google.com/) with a project set up

## Setting Up the Development Environment

1. **Expo CLI**: Install Expo CLI globally on your machine if you haven't already.

   ```bash
   npm install -g expo-cli
Android Studio: If you plan to run the app on an Android emulator, install Android Studio. Make sure to install the Android SDK and set up an emulator.

Xcode: If you plan to run the app on an iOS simulator, ensure you have Xcode installed (macOS only).

Firebase Configuration
Create a Firebase Project: Go to the Firebase Console, create a new project, and register your app for both iOS and Android.

Configure Firebase:

In the Firebase project, navigate to Project Settings and download the google-services.json file (for Android) and GoogleService-Info.plist file (for iOS).
Place these files in the correct directories:
android/app/google-services.json
ios/YourAppName/GoogleService-Info.plist
Firebase Authentication: Enable anonymous authentication in the Firebase console under Authentication > Sign-in method.

Firebase Firestore: Set up Firestore in your Firebase project. Use the following rules for testing:

plaintext
Code kopieren
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
Firebase Storage: Enable Firebase Storage for image uploads. Use the following rules for testing:

rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
Installing Dependencies
In your project directory, run the following commands to install all necessary libraries:

npm install
Additional Libraries
If any libraries are missing or need specific versions:

expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage @react-native-community/netinfo @expo/react-native-action-sheet firebase react-native-maps expo-image-picker expo-location
Running the App
Once all dependencies are installed and Firebase is configured, you can start the development server:

npx expo start
You can now run the app on an emulator or physical device:

For Android: Press a to launch the Android emulator.
For iOS: Press i to launch the iOS simulator.
Folder Structure
/components: Contains the main screens and custom components (e.g., Start.js, Chat.js, CustomActions.js).
/assets: Contains images and other static assets.
App.js: Main entry point of the application.
firebaseConfig.js: Contains the Firebase configuration.
package.json: Lists all dependencies and scripts.
Contributing
Contributions are welcome! Please fork this repository, make your changes, and submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
