import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  //forget password
  const forgotPassword =() => {
   
      firebase.auth().sendPasswordResetEmail(email)
      .then(()=>{
        alert("Password reset email sent to your email")
      }).catch((error)=>{
        alert(error)
      })
   
  
  };
  return (
    
    <View style={styles.container}>
 
     
      <Image source={require('../images/Logo.png')} style={styles.logo} />
   
      <Text style={{ fontWeight: "bold", fontSize: 26,marginTop: 20  }}>Login Page</Text>
      <View style={{ marginTop: 40 }}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity
        onPress={() => loginUser(email, password)}
        style={styles.button}
      >
        <Text style={{ fontWeight: "bold", fontSize: 22 }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Registration")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Don't have an account? Register Now
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => forgotPassword() }
        style={{ marginTop: 20 }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Forget Password?
        </Text>
      </TouchableOpacity>
      
    </View>
  );
 
  }
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },
  textInput: {
    paddingTop: 20,
    paddingBottom: 10,
    width: 400,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    marginTop:50,
    height:70,
    width:250,
    backgroundColor:"#026efd",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:50,
  },
  logo: {
    marginTop: -40,
   
   
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },


});
