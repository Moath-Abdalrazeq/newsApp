import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../../config";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const EditProfile = () => {
  const [user, setUser] = useState({});
  const [newBio, setNewBio] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [editBioModalVisible, setEditBioModalVisible] = useState(false);
  const [editProfileImageModalVisible, setEditProfileImageModalVisible] = useState(false);

  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot((doc) => {
        setUser(doc.data());
      });
    return unsubscribe;
  }, []);

  const handleEditBio = () => {
    setNewBio(user.bio || "");
    setEditBioModalVisible(true);
  };

  const handleEditProfileImage = () => {
    setEditProfileImageModalVisible(true);
  };

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled && result.assets.length > 0) {
      setNewProfileImage(result.assets[0].uri);
    }
  };

  const saveBio = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      await firebase.firestore().collection("users").doc(userId).update({ bio: newBio });
      setUser({ ...user, bio: newBio });
      setEditBioModalVisible(false);
    } catch (error) {
      console.log("Error updating bio:", error);
    }
  };

  const saveProfileImage = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      let downloadURL = user.profilePicture;

      if (newProfileImage) {
        const response = await fetch(newProfileImage);
        const blob = await response.blob();
        const imageRef = firebase.storage().ref().child(`profileImages/${userId}`);
        await imageRef.put(blob);

        downloadURL = await imageRef.getDownloadURL();
      } else {
        await firebase.firestore().collection("users").doc(userId).update({ profilePicture: null });
      }

      await firebase.firestore().collection("users").doc(userId).update({ profilePicture: downloadURL });

      setUser({ ...user, profilePicture: downloadURL });
      setEditProfileImageModalVisible(false);
    } catch (error) {
      console.log("Error updating profile image:", error);
    }
  };

  return (
    <View style={styles.container}>
       
      <TouchableOpacity onPress={handleEditProfileImage}>
        <Image source={{ uri: user.profilePicture || "https://via.placeholder.com/150" }} style={styles.profilePicture} />
      </TouchableOpacity>
      <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.bio}>bio :{newBio || user.bio || "No bio available"}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleEditBio}>
        <Text style={styles.addButtonText}>Edit Bio</Text>
      </TouchableOpacity>
      {/* Edit Bio Modal */}
      <Modal visible={editBioModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Edit Bio</Text>
          <TextInput style={styles.input} placeholder="Enter your bio" value={newBio} onChangeText={setNewBio} />
          <Button title="Save" onPress={saveBio} />
        </View>
        
      </Modal>

      {/* Edit Profile Image Modal */}
      <Modal visible={editProfileImageModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Edit Profile Image</Text>
          <Button title="Choose Image" onPress={handleChooseImage} />
          <Button title="Save" onPress={saveProfileImage} />
          {newProfileImage && <Image source={{ uri: newProfileImage }} style={styles.previewImage} />}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop:40
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  email:{
    fontSize: 16,
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
   
   
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,

  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bio: {
    fontSize: 16,
    padding: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "80%",
    padding: 10,
    marginBottom: 20,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
    marginBottom: 20,
  },
});

export default EditProfile;