import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/student/StudNavbar"; // Adjust the import path as needed
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

const GuidedMeditations = () => {
  // Refs for audio elements
  const audioRef1 = useRef(null);
  const audioRef2 = useRef(null);
  const audioRef3 = useRef(null);

  // State to track play/pause for each audio
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [isPlaying3, setIsPlaying3] = useState(false);

  // State to track current time and duration for each audio
  const [currentTime1, setCurrentTime1] = useState(0);
  const [duration1, setDuration1] = useState(0);
  const [currentTime2, setCurrentTime2] = useState(0);
  const [duration2, setDuration2] = useState(0);
  const [currentTime3, setCurrentTime3] = useState(0);
  const [duration3, setDuration3] = useState(0);

  // Function to toggle play/pause
  const togglePlay = (audioRef, setIsPlaying) => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Function to handle volume change
  const handleVolumeChange = (audioRef, volume) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  // Function to handle seek (fast forward/rewind)
  const handleSeek = (audioRef, time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Update current time and duration for audio 1
  useEffect(() => {
    const audio = audioRef1.current;
    if (audio) {
      const updateTime = () => setCurrentTime1(audio.currentTime);
      const updateDuration = () => setDuration1(audio.duration);
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
      };
    }
  }, []);

  // Update current time and duration for audio 2
  useEffect(() => {
    const audio = audioRef2.current;
    if (audio) {
      const updateTime = () => setCurrentTime2(audio.currentTime);
      const updateDuration = () => setDuration2(audio.duration);
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
      };
    }
  }, []);

  // Update current time and duration for audio 3
  useEffect(() => {
    const audio = audioRef3.current;
    if (audio) {
      const updateTime = () => setCurrentTime3(audio.currentTime);
      const updateDuration = () => setDuration3(audio.duration);
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
      };
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #F7CFD8, #F4F8D3, #A6F1E0, #73C7C7)",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      {/* <div className="relative w-full h-[60vh] md:h-[70vh] bg-cover bg-center flex items-center justify-center"> */}
        {/* Background Image */}
        {/* <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/guided-meditation-bg.jpg)" }}
        ></div> */}

        {/* Overlay for better readability */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-70"></div> */}

        {/* Hero Text */}
        {/* <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Mindfulness Sessions
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
            Explore guided meditations to help you relax, focus, and find inner peace.
          </p>
        </div> */}
      {/* </div> */}

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#073C7C] mb-6">
        Mindfulness Sessions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Meditation Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-[#73C7C7] mb-3">
              The Power of Breath
            </h3>
            <p className="text-gray-700 mb-4">10 Minutes to Calm</p>
            <div className="flex items-center gap-2 mb-4">
              <button
                className="bg-[#73C7C7] text-white px-4 py-2 rounded-lg hover:bg-[#5A9A9A] transition"
                onClick={() => togglePlay(audioRef1, setIsPlaying1)}
              >
                {isPlaying1 ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
              <FaVolumeUp className="text-gray-700" size={20} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="1"
                onChange={(e) => handleVolumeChange(audioRef1, e.target.value)}
                className="w-24"
              />
            </div>
            {/* Seek Bar for Audio 1 */}
            <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{formatTime(currentTime1)}</span>
            <input
              type="range"
              min="0"
              max={duration1}
              value={currentTime1}
              onChange={(e) => handleSeek(audioRef1, e.target.value)}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{formatTime(duration1)}</span>
            </div>
            {/* Audio for Card 1 */}
            <audio ref={audioRef1} src="/audios/FreeMindfulness10MinuteBreathing.mp3"></audio>
          </div>

          {/* Meditation Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-[#73C7C7] mb-3">
              Pause with Padraig
            </h3>
            <p className="text-gray-700 mb-4">A Mindfulness Session</p>
            <div className="flex items-center gap-2 mb-4">
              <button
                className="bg-[#73C7C7] text-white px-4 py-2 rounded-lg hover:bg-[#5A9A9A] transition"
                onClick={() => togglePlay(audioRef2, setIsPlaying2)}
              >
                {isPlaying2 ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
              <FaVolumeUp className="text-gray-700" size={20} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="1"
                onChange={(e) => handleVolumeChange(audioRef2, e.target.value)}
                className="w-24"
              />
            </div>
            {/* Seek Bar for Audio 2 */}
            <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{formatTime(currentTime2)}</span>
            <input
              type="range"
              min="0"
              max={duration2}
              value={currentTime2}
              onChange={(e) => handleSeek(audioRef1, e.target.value)}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{formatTime(duration2)}</span>
            </div>
            {/* Audio for Card 2 */}
            <audio ref={audioRef2} src="/audios/PadraigBriefMindfulnessPractice.mp3"></audio>
          </div>

          {/* Meditation Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-[#73C7C7] mb-3">
              Find Your Stillness
            </h3>
            <p className="text-gray-700 mb-4">6-Minute Breath Awareness</p>
            <div className="flex items-center gap-2 mb-4">
              <button
                className="bg-[#73C7C7] text-white px-4 py-2 rounded-lg hover:bg-[#5A9A9A] transition"
                onClick={() => togglePlay(audioRef3, setIsPlaying3)}
              >
                {isPlaying3 ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
              <FaVolumeUp className="text-gray-700" size={20} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="1"
                onChange={(e) => handleVolumeChange(audioRef3, e.target.value)}
                className="w-24"
              />
            </div>
            {/* Seek Bar for Audio 3 */}
            <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{formatTime(currentTime3)}</span>
            <input
              type="range"
              min="0"
              max={duration3}
              value={currentTime3}
              onChange={(e) => handleSeek(audioRef1, e.target.value)}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{formatTime(duration3)}</span>
            </div>
            {/* Audio for Card 3 */}
            <audio ref={audioRef3} src="/audios/StillMind6MinuteBreathAwareness.mp3"></audio>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedMeditations;