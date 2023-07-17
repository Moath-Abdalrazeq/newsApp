import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Video } from "expo-av";
import io from "socket.io-client";

const SERVER_URL = "http://192.168.1.100:3000";

export default function LiveStreamViewer() {
  const [isLivestreaming, setIsLivestreaming] = useState(false);

  useEffect(() => {
    const socket = io(SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("livestreamStarted", () => {
      console.log("Livestream started");
      setIsLivestreaming(true);
    });

    socket.on("livestreamStopped", () => {
      console.log("Livestream stopped");
      setIsLivestreaming(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      {isLivestreaming ? (
        <Video
          source={{ uri: `${SERVER_URL}/livestream/video` }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
        />
      ) : (
        <Text>No livestream currently available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: 300,
  },
});
