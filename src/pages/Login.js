import React, { useState, useEffect } from "react";
import {
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../config";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

const firebaseConfig = {
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
  storageBucket: "newsapp-32049.appspot.com",
  messagingSenderId: "109848058571",
  appId: "1:109848058571:web:2e5322e2a1d8251017594e",
  measurementId: "G-KVL2B1SPCG",};

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
     firebase.initializeApp(firebaseConfig);
  }, []);

  const loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert("The Email or Password you entered is invalid. Please try again.");
    }
  };

  const loginWithFacebook = async () => {
    try {
      const redirectUri = makeRedirectUri({ useProxy: true });
      const clientId = "812261680460378";

       const authUrl =
        `https://www.facebook.com/v12.0/dialog/oauth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent("public_profile,email")}`;

       const { type, params } = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      if (type === "success") {
        const { access_token } = params;

        const credential =
          firebase.auth.FacebookAuthProvider.credential(access_token);

        await firebase.auth().signInWithCredential(credential);
      } else if (type === "cancel") {
        console.log("Facebook login cancelled");
      } else {
        console.log("Error occurred during Facebook login");
      }
    } catch (error) {
      console.log("Error occurred during Facebook login", error);
    }
  };

  const forgotPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent to your email");
      })
      .catch(() => {
        alert("Please write your email address");
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <Image
              source={require("../../assets/images/Logo.png")}
              style={styles.logo}
            />
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../assets/images/email.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={(email) => setEmail(email)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../assets/images/lock.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={(password) => setPassword(password)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                />
              </View>
              <TouchableOpacity
                onPress={() => forgotPassword()}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPasswordText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => loginUser(email, password)}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => loginWithFacebook()}
                style={styles.facebookButton}
              >
                <Image
                  source={require('../../assets/images/Facebook_icon.png')}
                  style={styles.facebookIcon}
                />
                <Text style={styles.facebookButtonText}>
                  Login with Facebook
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Registration")}
                style={styles.signupButton}
              >
                <Text style={styles.signupText}>
                 Don't have an account? Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  safeAreaView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 40,
    marginLeft:90
    },
  form: {
    alignSelf: "stretch",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#888",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
  },
  facebookButton: {
    flexDirection: "row",
    backgroundColor: "#3B5998",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  facebookIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  facebookButtonText: {
    color: "#FFF",
    fontSize: 18,
  },
  signupButton: {
    alignSelf: "center",
  },
  signupText: {
    color: "#888",
    fontSize: 16,
  },
});

export default Login;