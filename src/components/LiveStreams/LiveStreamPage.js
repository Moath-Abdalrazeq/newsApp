import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { io } from 'socket.io-client';
import { Video } from 'expo-av';

const LiveStreamViewer = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamURL, setStreamURL] = useState('');
  const [isReadyToWatch, setIsReadyToWatch] = useState(false);

  useEffect(() => {
    const serverURL = 'http://192.168.0.105:3001'; // Replace with your server URL
    const socket = io(serverURL);

    socket.on('streamURL', (url) => {
      setStreamURL(url);
      setIsStreaming(true);
      setIsReadyToWatch(true); // Stream URL is available and ready to be watched
    });

    socket.on('noActiveBroadcaster', () => {
      setIsStreaming(false);
      setIsReadyToWatch(false); // There is no active broadcaster, stream URL is not available
    });

    socket.emit('watchStream');

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleWatchStream = () => {
    // Check if there is a valid streamURL before setting isReadyToWatch to true
    if (isStreaming && !!streamURL) {
      setIsReadyToWatch(true); // Set to true to show the Video component
    } else {
      // If there is no active broadcaster or streamURL is not available, try again later
      setIsReadyToWatch(false);
      setTimeout(handleWatchStream, 1000); // Try again after 1 second
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isStreaming && isReadyToWatch && !!streamURL ? (
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
          {isStreaming && !isReadyToWatch ? (
            <Text>Loading live stream...</Text>
          ) : (
            <Text>No live stream available.</Text>
          )}
          {!isReadyToWatch && (
            <Button title="Watch Live Stream" onPress={handleWatchStream} />
          )}
        </>
      )}
    </View>
  );
};

export default LiveStreamViewer;
