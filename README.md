# Mobile Messaging App

## Overview
This mobile messaging application is built with React Native. It offers a user-friendly chat interface, making it easy to share images and locations in real-time with other users.

## Key Features
- **Personalization**: Users can enter their name and choose a background color for the chat screen.
- **Chat Interface**: The screen displays the ongoing conversation and includes a text input field for typing messages, as well as a send button.
- **Multimedia Capabilities**: Users can share photos and their current location within the chat. The app supports both online and offline data storage for convenient access.

## Dependencies
- React Native
- Expo
- Firebase (Firestore, Auth, Storage)
- Gifted Chat
- AsyncStorage

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dantris/ChatApp.git

## Installation

2. **Install dependencies**:
   ```bash
   npm install

## Set up Firebase

1. **Create a Firebase account** and start a new project.
2. **Set up Firestore Database**:
   - Navigate to **Build** -> **Firestore Database** in the Firebase console.
   - Follow the prompts to configure your database.
3. **Enable Firebase Storage**:
   - Go to the **Storage** section in the Firebase console and enable it for your project.
4. **Modify the Security Rules**:
   - Replace the default rule:
     ```plaintext
     allow read, write: if false;
     ```
   - With:
     ```plaintext
     allow read, write: if true;
     ```

## Start the Expo Development Server

Run the following command to start the Expo development server:
```bash
npx expo start
```
## Usage

### Running on an Emulator
- Ensure you have an Android or iOS emulator running.
- In the Expo CLI, press `a` to launch the app on an Android emulator or `i` to launch it on an iOS simulator.

### Running on a Physical Device
- Download the **Expo Go** app from the App Store or Google Play.
- Open the **Expo Go** app and connect to your project to run the app on your device.
