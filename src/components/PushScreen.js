import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';

const PushScreen = ({ route }) => {
  const { pushserver, stream } = route.params;
  const [pushing, setPushing] = useState(false);
  const [status, setStatus] = useState('');

  const startPush = () => {
    setPushing(true);
  };

  const stopPush = () => {
    setPushing(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 10 }}>{pushing ? 'Pushing stream' : 'Not pushing'}</Text>
      <Text>Status: {status}</Text>
      {pushing ? (
        <Button title="Stop Push" onPress={stopPush} />
      ) : (
        <Button title="Start Push" onPress={startPush} />
      )}
      <NodeCameraView
        style={{ flex: 1 }}
        ref={(vb) => {}}
        outputUrl={pushserver + stream}
        camera={{ cameraId: 1, cameraFrontMirror: true }}
        audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
        video={{
          preset: 12,
          bitrate: 400000,
          profile: 1,
          fps: 15,
          videoFrontMirror: false,
        }}
        autopreview={true}
      />
    </View>
  );
};

export default PushScreen;
