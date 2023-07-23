import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { io } from 'socket.io-client';
import { Video } from 'expo-av';

const LiveStreamViewer = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamURL, setStreamURL] = useState('');

  useEffect(() => {
    const serverURL = 'http://192.168.1.104:3001'; // Replace with your server URL
    const socket = io(serverURL);

    socket.on('streamURL', (url) => {
      setStreamURL(url);
      setIsStreaming(true);
    });

    socket.on('noActiveBroadcaster', () => {
      setIsStreaming(false);
    });

    socket.emit('watchStream');

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleWatchStream = () => {
    setIsStreaming(true);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isStreaming ? (
        <Video
          source={{ uri: streamURL }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={{ width: 300, height: 200 }}
        />
      ) : (
        <>
          <Text>No live stream available.</Text>
          <Button title="Watch Live Stream" onPress={handleWatchStream} />
        </>
      )}
    </View>
  );
};

export default LiveStreamViewer;
