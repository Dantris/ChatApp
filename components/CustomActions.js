import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * CustomActions component for handling various user actions in the chat.
 * This component renders a button that opens an action sheet with options
 * to pick an image from the library, take a photo, or share the user's location.
 */
const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  const actionSheet = useActionSheet();

  /**
   * Handles the press event to show the action sheet with different options.
   */
  const onActionPress = () => {
    const options = ["Open Library", "Take Photo", "Send Location", "Cancel"];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage(); // Open image library
            return;
          case 1:
            takePhoto(); // Open camera
            return;
          case 2:
            getLocation(); // Share location
          default:
        }
      }
    );
  };

  /**
   * Uploads the image to Firebase Storage and sends the image message.
   * @param {string} imageURI - The URI of the image to upload.
   */
  const uploadAndSendImage = async (imageURI) => {
    try {
      const uniqueRefString = generateReference(imageURI); // Generate a unique reference for the image
      const newUploadRef = ref(storage, uniqueRefString);
      const response = await fetch(imageURI);
      const blob = await response.blob(); // Convert image URI to a blob
      const snapshot = await uploadBytes(newUploadRef, blob); // Upload the image
      const imageURL = await getDownloadURL(snapshot.ref); // Get the download URL

      // Send the image message
      onSend({
        _id: uniqueRefString,
        createdAt: new Date(),
        user: {
          _id: userID,
          name: "User",
        },
        image: imageURL,
      });
    } catch (error) {
      console.error("Error uploading image", error);
      Alert.alert("Error uploading image", error.message);
    }
  };

  /**
   * Opens the image library for the user to pick an image.
   */
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("An error occurred while picking the image.");
    }
  };

  /**
   * Opens the camera for the user to take a photo.
   */
  const takePhoto = async () => {
    try {
      let permissions = await ImagePicker.requestCameraPermissionsAsync();
      if (permissions.granted) {
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled) {
          await uploadAndSendImage(result.assets[0].uri);
        }
      } else {
        Alert.alert("Permissions haven't been granted.");
      }
    } catch (error) {
      console.error("Error taking photo: ", error);
      Alert.alert("An error occurred while taking the photo.");
    }
  };

  /**
   * Retrieves the user's current location and sends it as a message.
   */
  const getLocation = async () => {
    try {
      let permissions = await Location.requestForegroundPermissionsAsync();
      if (permissions.granted) {
        const location = await Location.getCurrentPositionAsync({});
        if (location) {
          onSend({
            _id: `${userID}-${new Date().getTime()}`,
            createdAt: new Date(),
            user: {
              _id: userID,
              name: "User",
            },
            location: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          });
        } else {
          Alert.alert("Error occurred while fetching location");
        }
      } else {
        Alert.alert("Permissions haven't been granted.");
      }
    } catch (error) {
      console.error("Error getting location: ", error);
      Alert.alert("An error occurred while fetching the location.");
    }
  };

  /**
   * Generates a unique reference string for the image based on its URI and current time.
   * @param {string} uri - The URI of the image.
   * @returns {string} - The generated reference string.
   */
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/").pop();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="More chat actions"
      accessibilityHint="Let’s you choose to send an image from your library, take a photo, or share your geolocation"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
    justifyContent: "center",
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 14,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
