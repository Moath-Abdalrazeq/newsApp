import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { io } from 'socket.io-client';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import * as FileSystem from 'expo-file-system';

const firebaseConfig = {
  apiKey: "AIzaSyA4RQu33i_jcHvtzq50w9rrTSJ_ZncGE3Q",
  authDomain: "newsapp-32049.firebaseapp.com",
  projectId: "newsapp-32049",
  storageBucket: "newsapp-32049.appspot.com",
  messagingSenderId: "109848058571",
  appId: "1:109848058571:web:2e5322e2a1d8251017594e",
  measurementId: "G-KVL2B1SPCG"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const LiveStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [streamURL, setStreamURL] = useState('');
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [recordingTime, setRecordingTime] = useState(0);
  const cameraRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    let intervalId;
    if (isRecording) {
      intervalId = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRecording]);

  const startStream = async () => {
    console.log('Starting the live stream...');
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.log('Camera permission not granted');
      return;
    }

    const { status: audioStatus } = await Audio.requestPermissionsAsync();
    if (audioStatus !== 'granted') {
      console.log('Audio permission not granted');
      return;
    }

    const serverURL = 'http://192.168.1.104:3001'; // Replace with your server URL
    socketRef.current = io(serverURL);
    socketRef.current.on('connect', () => {
      console.log('Socket connected, starting stream...');
      socketRef.current.emit('startStream');
      setIsStreaming(true);
      setIsRecording(true);
    });

    socketRef.current.on('streamURL', (url) => {
      setStreamURL(url);
    });

    setStreamURL('');

    const stream = await cameraRef.current.recordAsync({
      quality: '720p',
      maxDuration: 3600,
      mute: false,
    });

    setStreamURL(stream.uri);
  };

  const stopStream = async () => {
    console.log('Stopping the live stream...');
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  
    if (cameraRef.current && cameraRef.current.isRecording) {
      try {
        const recordedVideo = await cameraRef.current.stopRecording();
  
        if (recordedVideo && recordedVideo.uri) {
          setStreamURL(recordedVideo.uri);
          console.log('Recorded video URI:', recordedVideo.uri);
  
          try {
            // Code for reading the recorded video as a Base64 string and uploading it to Firebase Storage
            // Code for saving the download URL in Firestore
          } catch (error) {
            console.error('Error uploading the video:', error);
            setIsRecording(false); // Set isRecording to false to handle error scenario
          }
        } else {
          console.log('Recorded video is undefined or has no URI.');
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  
    setIsStreaming(false);
    setIsRecording(false);
    setStreamURL('');
    setRecordingTime(0);
  };

  const switchCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} ref={cameraRef} type={cameraType}>
          <TouchableOpacity style={styles.cameraSwitchButton} onPress={switchCameraType}>
            <Text style={styles.cameraSwitchButtonText}>
              {cameraType === Camera.Constants.Type.back ? 'Front' : 'Back'}
            </Text>
          </TouchableOpacity>
        </Camera>
      </View>
      <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
        {isStreaming ? (
          <>
            <Text style={styles.statusText}>
              {isRecording ? `Streaming... ${formatTime(recordingTime)}` : 'Streaming...'}
            </Text>
            <Button title="Stop Live Stream" onPress={stopStream} />
          </>
        ) : (
          <Button title="Start Live Stream" onPress={startStream} />
        )}
        {!isStreaming && !!streamURL && (
          <Text style={styles.streamUrlText}>Live Stream URL: {streamURL}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraSwitchButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  cameraSwitchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  statusText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  streamUrlText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});

export default LiveStream;