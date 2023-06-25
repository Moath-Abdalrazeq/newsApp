import React from 'react';
import { View } from 'react-native';
import LivestreamViewer from './LiveStreamViewer';

export default function LivestreamPage() {
  // Assuming you have the city name available, pass it to the LivestreamViewer component
  const city = 'Talfeet';

  return (
    <View style={{ flex: 1 }}>
      <LivestreamViewer city={city} />
    </View>
  );
}
