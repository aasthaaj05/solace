import React, { useState } from "react";
import Video from "twilio-video";

const VideoCall = ({ roomName, userId }) => {
  const [room, setRoom] = useState(null);

  const joinRoom = async () => {
    try {
      const response = await fetch(
        `https://your-firebase-cloud-function-url/generateToken?identity=${userId}&room=${roomName}`
      );
      const data = await response.json();
      const videoRoom = await Video.connect(data.token, { name: roomName });
      setRoom(videoRoom);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <div>
      <h2>Twilio Video Call</h2>
      {room ? (
        <p>Connected to {room.name}</p>
      ) : (
        <button onClick={joinRoom}>Join Room</button>
      )}
    </div>
  );
};

export default VideoCall;
