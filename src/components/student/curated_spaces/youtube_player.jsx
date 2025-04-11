import React from "react";
import YouTube from "react-youtube";
import "./youtube_player.css"; // Import the CSS file

const YouTubePlayer = ({ videoId }) => {
  const onReady = (event) => {
      event.target.setVolume(100); // Set volume to 100%
      event.target.unMute();       // Ensure it's unmuted
      event.target.playVideo();    // Optional: start playing immediately
  };

  const opts = {
      playerVars: {
          autoplay: 1,
          mute: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
      },
  };


  return (
    <div className="container">
      

      {/* Video (Right) */}
      <div className="video-box">
  <YouTube videoId={videoId} opts={opts} className="youtube-iframe" />
</div>
    </div>
  );
};

export default YouTubePlayer;
