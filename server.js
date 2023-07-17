const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 3000;
const fs = require("fs");

let isLivestreaming = false;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.post("/livestream/start", (req, res) => {
  if (isLivestreaming) {
    return res.status(400).send("Livestream already started");
  }

  try {
    isLivestreaming = true;
    console.log("Livestream started");
    io.emit("livestreamStarted", true);
    res.status(200).send("Livestream started successfully");
  } catch (error) {
    console.log("Error starting livestream:", error);
    res.status(500).send("Error starting livestream");
  }
});

app.post("/livestream/stop", (req, res) => {
  if (!isLivestreaming) {
    return res.status(400).send("Livestream not started");
  }

  try {
    isLivestreaming = false;
    console.log("Livestream stopped");
    io.emit("livestreamStopped", true);
    res.status(200).send("Livestream stopped successfully");
  } catch (error) {
    console.log("Error stopping livestream:", error);
    res.status(500).send("Error stopping livestream");
  }
});

app.get("/livestream/video", (req, res) => {
  const videoPath = "path/to/livestream/video.mp4"; // Provide the actual path to your livestream video file
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
