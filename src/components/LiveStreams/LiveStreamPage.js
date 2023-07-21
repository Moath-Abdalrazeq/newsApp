import React, { useEffect, useState } from 'react';
import { View , Text} from 'react-native';
import { Video } from 'expo-av';
import { io } from 'socket.io-client';

const LiveStreamViewer = () => {
  const [streamURL, setStreamURL] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Set up the socket to receive the stream from the server
    const socket = io('http://192.168.1.104:3001'); // Replace with your server URL

    socket.on('streamURL', (url) => {
      if (isMounted) {
        setStreamURL(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View >
      <Text>sss</Text>
      {streamURL && (
        <Video
          source={{ uri: streamURL }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          useNativeControls
         />
      )}
    </View>
  );
};

 
export default LiveStreamViewer;
