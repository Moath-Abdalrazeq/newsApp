import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
const firebaseConfig = {
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
  storageBucket: "newsapp-32049.appspot.com",
  messagingSenderId: "109848058571",
  appId: "1:109848058571:web:2e5322e2a1d8251017594e",
  measurementId: "G-KVL2B1SPCG"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
export default function LivestreamViewer({ city }) {
  const videoRef = useRef(null);
  const interactionRef = useRef(null);

  useEffect(() => {
    const fetchLivestreamUrl = async () => {
      try {
        // Query the streams collection for the livestream with the matching city name
        const streamQuery = await db
          .collection('streams')
          .where('city', '==', city)
          .get();
    
        if (!streamQuery.empty) {
          const streamSnapshot = streamQuery.docs[0];
          const streamData = streamSnapshot.data();
          const streamUrl = streamData?.streamUrl;
    
          if (streamUrl) {
            const video = videoRef.current;
            await video.unloadAsync();
    
            // Check if the livestream URL is valid
            const isUrlValid = await fetch(streamUrl).then(() => true).catch(() => false);
            if (!isUrlValid) {
              throw new Error('Invalid livestream URL');
            }
    
            // Check if the livestream is currently streaming
            const isLivestreamStreaming = await fetch(streamUrl, {
              method: 'HEAD',
              timeout: 1000,
            }).then((response) => response.status === 200);
            if (!isLivestreamStreaming) {
              throw new Error('Livestream is not currently streaming');
            }
    
            await video.loadAsync({ uri: streamUrl }, {}, false);
            await video.playAsync();
    
            // Subscribe to interaction updates
            const interactionCollection = db.collection(`streams/${streamSnapshot.id}/interactions`);
            interactionRef.current = interactionCollection.onSnapshot((snapshot) => {
              const interactions = snapshot.docs.map((doc) => doc.data());
              // Do something with the interactions (e.g., update UI)
            });
          }
        } else {
          console.log('No livestream found for the city:', city);
        }
      } catch (error) {
        console.error('Error fetching livestream URL:', error);
      }
    };
    

    fetchLivestreamUrl();

    return () => {
      // Unsubscribe from interaction updates
      if (interactionRef.current) {
        interactionRef.current();
      }
    };
  }, [city]);

  return (
    <View style={styles.container}>
      <Video ref={videoRef} style={styles.video} resizeMode="contain" />
      <TouchableOpacity style={styles.interactionButton}>
        <FontAwesome name="heart" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    flex: 1,
    width: '100%',
  },
  interactionButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'transparent',
    borderRadius: 50,
    padding: 10,
  },
});
