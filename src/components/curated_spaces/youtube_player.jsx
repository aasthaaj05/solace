import React from "react";
import YouTube from "react-youtube";
import "./youtube_player.css"; // Import the CSS file

const YouTubePlayer = ({ videoId }) => {
  const opts = {
    playerVars: {
      autoplay: 1,
      mute: 1,
      loop: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      disablekb: 1,
      playlist: videoId,
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
