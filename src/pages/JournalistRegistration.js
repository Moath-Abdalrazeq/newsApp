import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { firebase } from "../../config";
import * as DocumentPicker from "expo-document-picker";

const JournalistRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [organization, setOrganization] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (!result.cancelled) {
        const filename = getFilenameFromUri(result.uri);
        setSelectedFile({ uri: result.uri, filename });
      }
    } catch (error) {
      console.log("Error picking document:", error);
    }
  };

  const registerJournalist = async () => {
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const status = "pending";

      await firebase
        .firestore()
        .collection("users")
        .doc(userCredential.user.uid)
        .set({
          firstName,
          lastName,
          email,
          city,
          organization,
          role: "journalist",
          status,
          cv: selectedFile ? selectedFile.uri : null,
        });

      alert(
        "Please wait for the admin to send an acceptance message to your email."
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const getFilenameFromUri = (uri) => {
    if (!uri) return "";
    const path = uri.split("/");
    const filename = path[path.length - 1];
    return decodeURI(filename);
  };

  const getFilename = () => {
    if (selectedFile) {
      return selectedFile.filename;
    }
    return "";
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.root}>
            <View style={styles.container}>
              <Text
                style={{ fontWeight: "bold", fontSize: 30, marginBottom: 30 }}
              >
                Register as a journalist
              </Text>
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  onChangeText={setFirstName}
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  onChangeText={setLastName}
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={setEmail}
                  autoCorrect={false}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  onChangeText={setCity}
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Organization"
                  onChangeText={setOrganization}
                  autoCorrect={false}
                />
                <View style={styles.uploadSection}>
                  <Text style={styles.uploadLabel}>Upload your CV (PDF)</Text>
                  <TouchableOpacity
                    onPress={pickDocument}
                    style={styles.uploadButton}
                  >
                    <Text style={styles.uploadButtonText}>Choose PDF</Text>
                  </TouchableOpacity>
                  {selectedFile && (
                    <View style={styles.fileName}>
                      <Text style={styles.fileNameText}>
                        Selected file: {getFilename()}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  onPress={registerJournalist}
                  style={styles.button}
                >
                  <Text
                    style={{ fontWeight: "bold", fontSize: 22, color: "white" }}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  safeAreaView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 50,
    width: "100%",
    backgroundColor: "#f3f3f3",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#d9d9d9",
  },
  button: {
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 5,
    marginTop: 20,
  },
  uploadSection: {
    marginVertical: 20,
  },
  uploadLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadButtonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
  fileName: {
    marginTop: 10,
  },
  fileNameText: {
    fontSize: 16,
  },
});

export default JournalistRegistration;
