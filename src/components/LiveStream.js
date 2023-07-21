import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { io } from 'socket.io-client';
import firebase from 'firebase/app';
import 'firebase/firestore';

const LiveStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamURL, setStreamURL] = useState('');
  const cameraRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const startStream = async () => {
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
      socketRef.current.emit('startStream');
      setIsStreaming(true);
    });

    socketRef.current.on('streamURL', (url) => {
      setStreamURL(url);
    });

    // Set streamURL to an empty string initially when starting the stream
    setStreamURL('');

    const stream = await cameraRef.current.recordAsync({
      quality: '720p',
      maxDuration: 3600,
      mute: false,
    });

    setStreamURL(stream.uri);
  };

  const stopStream = async () => {
    // Stop the live stream on the server
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  
    // Stop the camera recording
    if (cameraRef.current && cameraRef.current.isRecording) {
      try {
        const recordedVideo = await cameraRef.current.stopRecording();
  
        if (recordedVideo && recordedVideo.uri) {
          // Update streamURL with the recorded video URI
          setStreamURL(recordedVideo.uri);
  
          // Upload the recorded video to Firestore (if you've implemented this functionality)
          // ... (code to upload the video to Firestore)
        } else {
          console.log('Recorded video is undefined or has no URI.');
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  
    // Set isStreaming to false and streamURL to an empty string
    setIsStreaming(false);
    setStreamURL('');
  };
  

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} ref={cameraRef} type={Camera.Constants.Type.front} />
      {isStreaming ? (
        <Button title="Stop Live Stream" onPress={stopStream} />
      ) : (
        <Button title="Start Live Stream" onPress={startStream} />
      )}
      {isStreaming && <Text>Streaming...</Text>}
      {!isStreaming && !!streamURL && <Text>Live Stream URL: {streamURL}</Text>}
    </View>
  );
};

export default LiveStream;
