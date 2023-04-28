import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
  storageBucket: "newsapp-32049.appspot.com",
  messagingSenderId: "109848058571",
  appId: "1:109848058571:web:2e5322e2a1d8251017594e",
  measurementId: "G-KVL2B1SPCG"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.firestore();

const AddNews = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [source, setSource] = useState('');

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        setImage(response);
      }
    });
  };

  const handleSubmit = async () => {
    const newsRef = firebase.firestore().collection('news');
    const storageRef = firebase.storage().ref(`news/${image.fileName}`);
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const uploadTask = storageRef.put(blob);
    uploadTask.on('state_changed', null, error => console.error(error), async () => {
      const downloadURL = await storageRef.getDownloadURL();
      const newNews = {
        title: title,
        description: description,
        image: downloadURL,
        source: source,
      };
      newsRef.add(newNews).then(() => {
        setTitle('');
        setDescription('');
        setImage(null);
        setSource('');
        Alert.alert('News added successfully!');
      })
      .catch((error) => {
        Alert.alert('Error adding news: ', error);
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text> 
      <TextInput style={styles.input} value={title} onChangeText={(text) => setTitle(text)} />
      <Text style={styles.label}>Description:</Text>   
      <TextInput style={[styles.input, styles.descriptionInput]} value={description} onChangeText={(text) => setDescription(text)} multiline />
      <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Choose Photo</Text>
      </TouchableOpacity>
      {image && (
        <View>
          <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />
        </View>
      )}
      <Text style={styles.label}>Source:</Text>   
      <TextInput style={styles.input} value={source} onChangeText={(text) => setSource(text)} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={!image}>
        <Text style={styles.buttonText}>Add News</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default AddNews;
