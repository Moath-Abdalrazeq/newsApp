const express = require('express');
const app = express();
const port = 3000;

const { Camera } = require('expo-camera');

let isLivestreaming = false;
let camera = null;

app.post('/livestream/start', async (req, res) => {
  if (isLivestreaming) {
    return res.status(400).send('Livestream already started');
  }

  try {
    await startLivestream();
    isLivestreaming = true;
    console.log('Livestream started');
    res.status(200).send('Livestream started successfully');
  } catch (error) {
    console.log('Error starting livestream:', error);
    res.status(500).send('Error starting livestream');
  }
});

app.post('/livestream/stop', async (req, res) => {
  if (!isLivestreaming) {
    return res.status(400).send('Livestream not started');
  }

  try {
    await stopLivestream();
    isLivestreaming = false;
    console.log('Livestream stopped');
    res.status(200).send('Livestream stopped successfully');
  } catch (error) {
    console.log('Error stopping livestream:', error);
    res.status(500).send('Error stopping livestream');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function startLivestream() {
  console.log('Starting livestream...');
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Camera permission not granted');
  }

  camera = new Camera();
  await camera.initializeAsync();

  // Start capturing frames
  camera.startRecording();

  // Set up frame capture event listener
  camera.onFrameCaptured = async ({ data }) => {
    // Process the captured frame
    // Replace this code with your own frame processing logic
    // For example, you can send the frame to a server for processing
    const frameData = data.toString('base64');
    await sendFrameToServer(frameData);
  };
}

async function sendFrameToServer(frameData) {
  // Replace this code with your own server integration logic
  // For example, you can use a library like axios or fetch to send the frame data to a server
  const response = await fetch(`${SERVER_URL}/livestream/frames`, {
    method: 'POST',
    body: JSON.stringify({ frameData }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.ok) {
    console.log('Frame processed successfully');
  } else {
    console.log('Failed to process frame');
  }
}

async function stopLivestream() {
  console.log('Stopping livestream...');
  if (camera) {
    // Stop capturing frames
    camera.stopRecording();

    // Clean up camera resources
    await camera.release();
    camera = null;
  }
}